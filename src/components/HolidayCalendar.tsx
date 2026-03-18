import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';

interface HolidayCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HolidayCalendar({ isOpen, onClose }: HolidayCalendarProps) {
  const holidays = [
    { name: "Purim", date: "March 24", hours: "7:00 AM - 4:00 PM", note: "Closing early" },
    { name: "Pesach (Erev)", date: "April 22", hours: "7:00 AM - 1:00 PM", note: "Closing early for Seder" },
    { name: "Pesach (Chol HaMoed)", date: "April 25-28", hours: "Regular Hours", note: "Open" },
    { name: "Shavuot (Erev)", date: "June 11", hours: "7:00 AM - 2:00 PM", note: "Closing early" },
    { name: "Tisha B'Av", date: "August 13", hours: "12:00 PM - 8:00 PM", note: "Opening late" },
    { name: "Rosh Hashanah (Erev)", date: "October 2", hours: "7:00 AM - 2:00 PM", note: "Closing early" },
    { name: "Yom Kippur (Erev)", date: "October 11", hours: "7:00 AM - 1:00 PM", note: "Closing early" },
    { name: "Sukkot (Erev)", date: "October 16", hours: "7:00 AM - 2:00 PM", note: "Closing early" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full flex flex-col relative"
          >
            <div className="bg-blue-900 text-white p-6 md:p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center text-blue-200">
                  <Calendar size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Holiday Schedule 2026</h2>
                  <p className="text-blue-200 text-sm mt-1">Special hours for upcoming Yomim Tovim</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 bg-blue-800/50 hover:bg-blue-800 rounded-full transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {holidays.map((holiday, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-slate-50">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="font-bold text-lg text-slate-900">{holiday.name}</h3>
                      <div className="text-slate-500 font-medium">{holiday.date}</div>
                    </div>
                    <div className="sm:text-right">
                      <div className="font-black text-blue-900 text-lg">{holiday.hours}</div>
                      <div className="text-sm font-medium text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded mt-1 border border-amber-100">
                        {holiday.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 text-center">
                <strong>Note:</strong> We are strictly closed on all Yomim Tovim and Shabbat. Hours are subject to change based on zmanim.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
