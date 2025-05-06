"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface AlertMessageProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error';
}

export function AlertMessage({ 
  isOpen, 
  onClose,
  message,
  type = 'success'
}: AlertMessageProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="pointer-events-auto fixed top-4 right-4 z-50"
        >
          <div className={`bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 max-w-sm border
            ${type === 'success' ? 'border-green-100 dark:border-green-900' : 'border-red-100 dark:border-red-900'}`}>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {type === 'success' ? (
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  )}
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {type === 'success' ? 'Sucesso!' : 'Erro!'}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {message}
                </motion.p>
              </div>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3 }}
              className={`absolute bottom-0 left-0 h-1 origin-left
                ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: "100%" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 