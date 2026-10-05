import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { Couple } from './components/Couple';
import { ScheduleLocation } from './components/ScheduleLocation';
import { Gallery } from './components/Gallery';
import { RsvpForm } from './components/RsvpForm';
import { MessageWall } from './components/MessageWall';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => {
      setShowAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (showAdmin) {
    return (
      <AdminDashboard onBack={() => {
        window.location.hash = '';
        setShowAdmin(false);
      }} />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F6] font-sans text-[#1A2820] relative selection:bg-[#2D6A4F] selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Experience */}
      <main>
        <Hero />
        <Story />
        <Couple />
        <ScheduleLocation />
        <Gallery />
        <RsvpForm />
        <MessageWall />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => {
        window.location.hash = 'admin';
        setShowAdmin(true);
      }} />
    </div>
  );
}
