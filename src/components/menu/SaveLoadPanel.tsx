import { useState, useRef, useEffect } from 'react';
import { Button } from '@components/common/Button';
import { SaveManager } from '@core/save/SaveManager';
import { SaveGame } from '@core/types/GameState';

interface SaveLoadPanelProps {
  currentSaveGame: SaveGame | null;
  onImportSave: (saveGame: SaveGame) => void;
  onClose: () => void;
}

type TabType = 'export' | 'import';

export function SaveLoadPanel({ currentSaveGame, onImportSave, onClose }: SaveLoadPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [exportText, setExportText] = useState('');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availableSave, setAvailableSave] = useState<SaveGame | null>(null);

  // Check for available save game on mount
  useEffect(() => {
    // First check if there's a current game in memory
    if (currentSaveGame) {
      setAvailableSave(currentSaveGame);
    } else {
      // Otherwise, check localStorage
      const savedGame = SaveManager.loadFromLocalStorage();
      setAvailableSave(savedGame);
    }
  }, [currentSaveGame]);

  // Export handlers
  const handleExportAsText = () => {
    if (!availableSave) {
      setMessage({ type: 'error', text: 'No save game available to export!' });
      return;
    }

    const text = SaveManager.exportToText(availableSave);
    setExportText(text);
    setMessage({ type: 'success', text: 'Save game encoded as text! Copy the text below.' });
  };

  const handleExportAsFile = () => {
    if (!availableSave) {
      setMessage({ type: 'error', text: 'No save game available to export!' });
      return;
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `save-${timestamp}.emojybattler`;

    // Export as text (same format as "Generate Text Code")
    const text = SaveManager.exportToText(availableSave);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: `Save game downloaded as ${filename}` });
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setMessage({ type: 'success', text: 'Copied to clipboard!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to copy to clipboard.' });
    }
  };

  // Import handlers
  const handleImportFromText = () => {
    if (!importText.trim()) {
      setMessage({ type: 'error', text: 'Please paste save game text first!' });
      return;
    }

    const saveGame = SaveManager.importFromText(importText.trim());
    if (!saveGame) {
      setMessage({ type: 'error', text: 'Invalid save game text! Please check the format.' });
      return;
    }

    onImportSave(saveGame);
    setMessage({ type: 'success', text: 'Save game imported successfully!' });
    setTimeout(() => onClose(), 2000);
  };

  const handleImportFromFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const saveGame = await SaveManager.readSaveFile(file);
    if (!saveGame) {
      setMessage({ type: 'error', text: 'Invalid save game file! Please check the file.' });
      return;
    }

    onImportSave(saveGame);
    setMessage({ type: 'success', text: `Save game imported from ${file.name}!` });
    setTimeout(() => onClose(), 2000);
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="max-w-2xl w-full bg-gray-900 rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">💾 Save Game Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Export your save game for backup or to continue on another device. Import a previously exported save game to restore your progress.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('export');
              setMessage(null);
              setImportText('');
            }}
            className={`flex-1 px-4 py-2 rounded font-semibold transition-colors ${
              activeTab === 'export'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📤 Export
          </button>
          <button
            onClick={() => {
              setActiveTab('import');
              setMessage(null);
              setExportText('');
            }}
            className={`flex-1 px-4 py-2 rounded font-semibold transition-colors ${
              activeTab === 'import'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📥 Import
          </button>
        </div>

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-bold mb-3">Export Options</h3>

              <div className="space-y-3">
                <div>
                  <Button
                    variant="primary"
                    onClick={handleExportAsFile}
                    className="w-full"
                    disabled={!availableSave}
                  >
                    📁 Download as File (.emojybattler)
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Best for long-term backup and easy sharing
                  </p>
                </div>

                <div>
                  <Button
                    variant="secondary"
                    onClick={handleExportAsText}
                    className="w-full"
                    disabled={!availableSave}
                  >
                    📋 Generate Text Code
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Quick copy-paste for temporary backup
                  </p>
                </div>
              </div>
            </div>

            {exportText && (
              <div className="bg-gray-800 rounded-lg p-4 border border-green-700">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-green-400">Your Save Code ({exportText.length} characters):</h3>
                  <Button
                    variant="primary"
                    onClick={handleCopyToClipboard}
                    className="text-xs px-3 py-1"
                  >
                    📋 Copy
                  </Button>
                </div>
                <textarea
                  value={exportText}
                  readOnly
                  className="w-full bg-gray-900 text-white text-sm p-3 rounded border border-gray-600 font-mono resize-none"
                  style={{ height: '200px' }}
                  onClick={(e) => e.currentTarget.select()}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Copy this text and save it somewhere safe. You can use it to restore your game later.
                </p>
              </div>
            )}

            {availableSave && (
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <p className="text-green-400 text-sm font-semibold mb-1">
                  ✓ Save Game Available
                </p>
                <p className="text-gray-400 text-xs">
                  Round {availableSave.gameState.currentRound} • {availableSave.gameState.difficulty.level} •
                  {availableSave.totalSkillPoints} skill points
                </p>
              </div>
            )}

            {!availableSave && (
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  ⚠️ No save game found. Start a new game to create a save.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-bold mb-3">Import Options</h3>

              <div className="space-y-3">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".emojybattler"
                    onChange={handleImportFromFile}
                    className="hidden"
                  />
                  <Button
                    variant="primary"
                    onClick={handleSelectFile}
                    className="w-full"
                  >
                    📁 Upload File (.emojybattler)
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Select a previously downloaded save file
                  </p>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <label className="text-sm font-bold text-gray-300 block mb-2">
                    Or paste save code:
                  </label>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste your save code here..."
                    className="w-full bg-gray-900 text-gray-300 text-xs p-3 rounded border border-gray-600 font-mono h-32 resize-none"
                  />
                  <Button
                    variant="secondary"
                    onClick={handleImportFromText}
                    className="w-full mt-2"
                    disabled={!importText.trim()}
                  >
                    📥 Import from Text
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
              <p className="text-red-400 text-sm font-semibold mb-1">⚠️ Warning</p>
              <p className="text-gray-400 text-xs">
                Importing a save game will overwrite your current progress. Make sure to export your current save first if you want to keep it!
              </p>
            </div>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-900/20 border-green-600 text-green-400'
                : 'bg-red-900/20 border-red-600 text-red-400'
            }`}
          >
            <p className="text-sm font-semibold">
              {message.type === 'success' ? '✓' : '✗'} {message.text}
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <Button variant="secondary" onClick={onClose} className="px-8">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
