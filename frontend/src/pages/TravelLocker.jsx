import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, Upload, Trash2, File as FileIcon, Download } from "lucide-react";

export default function TravelLocker() {
  const [notes, setNotes] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("travelLocker_notes");
    if (savedNotes) setNotes(savedNotes);

    const savedDocs = localStorage.getItem("travelLocker_documents");
    if (savedDocs) setDocuments(JSON.parse(savedDocs));
  }, []);

  // Save to localStorage when things change
  useEffect(() => {
    localStorage.setItem("travelLocker_notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("travelLocker_documents", JSON.stringify(documents));
  }, [documents]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // Convert to base64 for local storage (mock upload)
    const reader = new FileReader();
    reader.onloadend = () => {
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(1) + " KB",
        date: new Date().toLocaleDateString(),
        dataUrl: reader.result
      };
      
      setDocuments(prev => [...prev, newDoc]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-cyan-600 to-indigo-700 dark:from-slate-900 dark:to-indigo-950 py-16 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <Briefcase className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Travel Locker</h1>
            <p className="text-cyan-100 text-lg">Securely store your documents, tickets, and trip notes.</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Documents */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileIcon className="w-6 h-6 text-teal-500" />
                Your Documents
              </h2>
              
              <label className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition font-medium shadow-sm">
                <Upload className="w-4 h-4" />
                Upload File
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </label>
            </div>

            {isUploading && (
              <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 mb-4 text-center text-slate-500">
                Uploading document...
              </div>
            )}

            {documents.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 dark:text-slate-400">
                <FileIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet.</p>
                <p className="text-sm mt-1">Upload your passport copy, tickets, or bookings here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition shadow-sm"
                    >
                      <button 
                        onClick={() => deleteDocument(doc.id)}
                        className="absolute top-3 right-3 p-1.5 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-xl">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate" title={doc.name}>
                            {doc.name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.date}</span>
                          </div>
                          
                          <a 
                            href={doc.dataUrl} 
                            download={doc.name}
                            className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 text-sm font-medium mt-3 hover:underline"
                          >
                            <Download className="w-3 h-3" /> Download
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Notes */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-500" />
              Quick Trip Notes
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Jot down important addresses, confirmation numbers, or reminders. Saves automatically.
            </p>
            <textarea
              className="flex-grow w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[200px]"
              placeholder="e.g., Hotel check-in code: 49382..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
