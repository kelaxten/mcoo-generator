import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveProject, loadProjectFile } from './exportUtils';

// ─── saveProject ──────────────────────────────────────────────────────────────

describe('saveProject', () => {
  let mockAnchor;
  let capturedBlobParts;
  let OrigBlob;

  beforeEach(() => {
    capturedBlobParts = null;
    OrigBlob = global.Blob;

    // Must be a regular function (not arrow) so it can be used as `new Blob(...)`.
    global.Blob = function MockBlob(parts, opts) {
      capturedBlobParts = parts;
      return new OrigBlob(parts, opts);
    };

    // Intercept the download anchor.
    mockAnchor = { click: vi.fn(), download: '', href: '' };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);
  });

  afterEach(() => {
    global.Blob = OrigBlob;
    vi.restoreAllMocks();
  });

  it('serializes project data to valid JSON', () => {
    const data = { version: '1.0', elements: [{ id: 'el_0001', type: 'water' }] };
    saveProject(data, 'test.mcoo');
    expect(capturedBlobParts).not.toBeNull();
    const parsed = JSON.parse(capturedBlobParts[0]);
    expect(parsed).toEqual(data);
  });

  it('triggers a download click', () => {
    saveProject({ version: '1.0', elements: [] }, 'test.mcoo');
    expect(mockAnchor.click).toHaveBeenCalledOnce();
  });

  it('sets the correct download filename', () => {
    saveProject({ version: '1.0', elements: [] }, 'my-overlay.mcoo');
    expect(mockAnchor.download).toBe('my-overlay.mcoo');
  });

  it('uses default filename when none is provided', () => {
    saveProject({ version: '1.0', elements: [] });
    expect(mockAnchor.download).toBe('mcoo-project.mcoo');
  });

  it('sets href to the object URL', () => {
    saveProject({ version: '1.0', elements: [] }, 'test.mcoo');
    expect(mockAnchor.href).toBe('blob:mock-url');
  });

  it('schedules revokeObjectURL cleanup', () => {
    vi.useFakeTimers();
    saveProject({ version: '1.0', elements: [] }, 'test.mcoo');
    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    vi.useRealTimers();
  });
});

// ─── loadProjectFile ──────────────────────────────────────────────────────────

describe('loadProjectFile', () => {
  let mockInput;

  beforeEach(() => {
    mockInput = {
      type: '',
      accept: '',
      onchange: null,
      click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockInput);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Simulate a user selecting a file with the given text content.
   * Hooks into the FileReader by replacing it on globalThis.
   */
  function simulateFileSelect(fileContent) {
    // Set up a FileReader mock that fires onload synchronously.
    const OrigFileReader = global.FileReader;
    global.FileReader = class {
      readAsText() {
        Promise.resolve().then(() => {
          this.onload({ target: { result: fileContent } });
        });
      }
    };

    // Trigger the file input's onchange handler.
    const fakeFile = new Blob([fileContent], { type: 'application/json' });
    mockInput.onchange({ target: { files: [fakeFile] } });

    global.FileReader = OrigFileReader;
  }

  it('resolves with parsed JSON for a valid .mcoo file', async () => {
    const project = { version: '1.0', elements: [{ id: 'el_0001' }] };
    const promise = loadProjectFile();
    simulateFileSelect(JSON.stringify(project));
    const result = await promise;
    expect(result).toEqual(project);
  });

  it('rejects with "Invalid .mcoo file" for malformed JSON', async () => {
    const promise = loadProjectFile();
    simulateFileSelect('{ not valid json !!!');
    await expect(promise).rejects.toThrow('Invalid .mcoo file');
  });

  it('triggers the hidden file input click', () => {
    loadProjectFile();
    expect(mockInput.click).toHaveBeenCalledOnce();
  });

  it('sets the accept attribute to .mcoo,application/json', () => {
    loadProjectFile();
    expect(mockInput.accept).toBe('.mcoo,application/json');
  });
});
