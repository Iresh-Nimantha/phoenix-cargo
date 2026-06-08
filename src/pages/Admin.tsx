import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { defaultContent } from '../utils/contentStore';
import { toast } from 'react-hot-toast';
import { ArrowUp, ArrowDown, Plus, Trash2, LogOut, Save, RotateCcw, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type SectionType =
  | 'general'
  | 'nav'
  | 'hero'
  | 'ticker'
  | 'services'
  | 'about'
  | 'stats'
  | 'whyUs'
  | 'cta'
  | 'contact'
  | 'footer'
  | 'password';

export default function Admin() {
  const { content, updateContent, isDirty, save } = useContent();
  const { user, loading: authLoading, login, logout, resetPassword } = useAuth();

  // Auth States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>('general');

  // Password reset email state
  const [resetSending, setResetSending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      toast.error('Please enter both email and password');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(emailInput, passwordInput);
      toast.success('Access Granted - Welcome back!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (err: any) {
      toast.error('Failed to log out');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all content to the original Phoenix Cargo defaults? All unsaved changes will be lost.')) {
      updateContent({ ...defaultContent });
      toast.success('Reset to defaults. Remember to save changes.');
    }
  };

  const handleSaveChanges = () => {
    save();
    toast.success('All changes saved to system!');
  };

  // Helper space preservation hint
  const SpaceHint = () => (
    <span className="space-hint" style={{ display: 'block', fontSize: '11px', color: 'var(--clr-ash-400)', marginTop: '4px', fontStyle: 'italic' }}>
      Spaces are preserved exactly as typed, including leading and trailing spaces.
    </span>
  );

  // Authentication Loading Screen
  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--clr-ash-900)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(232,97,10,0.15)', borderTopColor: 'var(--clr-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Authentication Gate Panel
  if (!user) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--clr-ash-900)',
          color: 'var(--clr-text-primary)',
          padding: '20px'
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            background: 'var(--clr-ash-800)',
            border: '1px solid var(--clr-border)',
            borderRadius: '4px',
            padding: '40px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 8px 32px var(--clr-shadow)',
            textAlign: 'center'
          }}
        >
          <img
            src="/images/phoenix-cargo-logo.jpeg"
            alt="Phoenix Cargo Brand Logo"
            onError={(e) => {
              e.currentTarget.src = '/logo.png';
            }}
            style={{ maxHeight: '80px', width: 'auto', marginBottom: '20px', borderRadius: '4px' }}
          />
          <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: '24px', fontSize: '24px' }}>
            Phoenix Cargo CMS
          </h2>
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <label className="admin-label">Admin Email</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="admin@phoenixcargo.lk"
              required
              className="admin-input"
            />
          </div>
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label className="admin-label">Password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
              required
              className="admin-input"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--clr-fire-crimson), var(--clr-fire-orange))',
              color: 'var(--clr-white)',
              border: 'none',
              padding: '14px',
              fontFamily: 'var(--font-cond)',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: '2px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] min-h-screen bg-[var(--clr-ash-900)] text-[var(--clr-text-primary)]">
      {/* LEFT SIDEBAR */}
      <aside className="bg-[var(--clr-ash-800)] border-b lg:border-b-0 lg:border-r border-[var(--clr-border)] flex flex-col w-full lg:h-screen">
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(232,97,10,0.1)' }} className="flex justify-between items-center lg:block">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/images/phoenix-cargo-logo.jpeg"
              alt="Logo"
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
              style={{ height: '36px', width: 'auto', borderRadius: '2px' }}
            />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 900, color: 'var(--clr-white)' }}>
              PHOENIX PANEL
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex overflow-x-auto lg:overflow-x-visible lg:flex-col gap-1 p-4 lg:p-0 scrollbar-none lg:flex-grow">
          {[
            { id: 'general', label: 'General / Meta' },
            { id: 'nav', label: 'Navigation' },
            { id: 'hero', label: 'Hero Section' },
            { id: 'ticker', label: 'Ticker Band' },
            { id: 'services', label: 'Services Grid' },
            { id: 'about', label: 'About Us' },
            { id: 'stats', label: 'Stats Counter' },
            { id: 'whyUs', label: 'Why Choose Us' },
            { id: 'cta', label: 'CTA Band' },
            { id: 'contact', label: 'Contact & Address' },
            { id: 'footer', label: 'Footer Settings' },
            { id: 'password', label: 'Admin Security' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as SectionType)}
              className="whitespace-nowrap text-left border-b-2 lg:border-b-0 lg:border-l-[3px] border-transparent transition-all duration-200"
              style={{
                padding: '12px 20px',
                fontFamily: 'var(--font-cond)',
                fontSize: '11px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                background: activeSection === item.id ? 'rgba(232, 97, 10, 0.05)' : 'transparent',
                color: activeSection === item.id ? 'var(--clr-fire-amber)' : 'var(--clr-ash-400)',
                borderBottomColor: activeSection === item.id ? 'var(--clr-fire-orange)' : 'transparent',
                borderLeftColor: activeSection === item.id ? 'var(--clr-fire-orange)' : 'transparent',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(232,97,10,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--clr-text-primary)',
              padding: '10px',
              fontFamily: 'var(--font-cond)',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* RIGHT EDITING WORKSPACE */}
      <main className="flex flex-col min-h-0 lg:h-screen lg:overflow-hidden">
        {/* TOP STATUS CONTROL BAR */}
        <div
          style={{
            height: '72px',
            background: 'var(--clr-ash-800)',
            borderBottom: '1px solid var(--clr-border)',
            padding: '0 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-cond)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Content Administration
            </h1>
            {isDirty && (
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--clr-fire-amber)',
                  display: 'inline-block'
                }}
                title="Unsaved changes present"
              />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-cond)',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: 'var(--clr-ash-200)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Preview Site <ExternalLink size={14} />
            </a>

            <button
              onClick={handleResetDefaults}
              style={{
                background: 'transparent',
                border: '1px solid var(--clr-fire-crimson)',
                color: 'var(--clr-fire-red)',
                padding: '8px 16px',
                fontFamily: 'var(--font-cond)',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600,
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>

            <button
              onClick={handleSaveChanges}
              style={{
                background: 'var(--clr-fire-orange)',
                border: 'none',
                color: 'var(--clr-white)',
                padding: '8px 20px',
                fontFamily: 'var(--font-cond)',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>

        {/* WORKSPACE CONTENT AREA */}
        <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
          {/* A. GENERAL / META SECTION */}
          {activeSection === 'general' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                General Settings & Search Engine Metadata
              </h2>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Site Window Title</label>
                <input
                  type="text"
                  value={content.meta.siteTitle}
                  onChange={(e) => updateContent({ ...content, meta: { ...content.meta, siteTitle: e.target.value } })}
                  className="admin-input"
                  style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px', outline: 'none' }}
                />
                <SpaceHint />
              </div>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Meta Description (SEO)</label>
                <textarea
                  value={content.meta.metaDescription}
                  onChange={(e) => updateContent({ ...content, meta: { ...content.meta, metaDescription: e.target.value } })}
                  className="admin-textarea"
                  style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px', outline: 'none', resize: 'vertical', minHeight: '100px' }}
                />
              </div>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Theme Primary Accent Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="color"
                    value={content.meta.themeColor}
                    onChange={(e) => updateContent({ ...content, meta: { ...content.meta, themeColor: e.target.value } })}
                    style={{ background: 'none', border: 'none', width: '40px', height: '40px', cursor: 'pointer' }}
                  />
                  <span>{content.meta.themeColor}</span>
                </div>
              </div>
            </div>
          )}

          {/* B. NAVIGATION SECTION */}
          {activeSection === 'nav' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Navigation Link Configurations
              </h2>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Brand Logo Alt Name Text</label>
                <input
                  type="text"
                  value={content.nav.logoAlt}
                  onChange={(e) => updateContent({ ...content, nav: { ...content.nav, logoAlt: e.target.value } })}
                  className="admin-input"
                  style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px', outline: 'none' }}
                />
              </div>

              <div style={{ margin: '32px 0 24px 0' }}>
                <h3 style={{ fontFamily: 'var(--font-cond)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-white)', marginBottom: '16px' }}>Nav Links List</h3>
                {content.nav.links.map((link, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...content.nav.links];
                        newLinks[idx].label = e.target.value;
                        updateContent({ ...content, nav: { ...content.nav, links: newLinks } });
                      }}
                      className="admin-input"
                      style={{ flex: 1, background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                    />
                    <input
                      type="text"
                      placeholder="Href Target (e.g. #services)"
                      value={link.href}
                      onChange={(e) => {
                        const newLinks = [...content.nav.links];
                        newLinks[idx].href = e.target.value;
                        updateContent({ ...content, nav: { ...content.nav, links: newLinks } });
                      }}
                      className="admin-input"
                      style={{ flex: 1, background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => {
                          if (idx > 0) {
                            const newLinks = [...content.nav.links];
                            const temp = newLinks[idx];
                            newLinks[idx] = newLinks[idx - 1];
                            newLinks[idx - 1] = temp;
                            updateContent({ ...content, nav: { ...content.nav, links: newLinks } });
                          }
                        }}
                        style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-border)', cursor: 'pointer', color: 'var(--clr-ash-200)' }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (idx < content.nav.links.length - 1) {
                            const newLinks = [...content.nav.links];
                            const temp = newLinks[idx];
                            newLinks[idx] = newLinks[idx + 1];
                            newLinks[idx + 1] = temp;
                            updateContent({ ...content, nav: { ...content.nav, links: newLinks } });
                          }
                        }}
                        style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-border)', cursor: 'pointer', color: 'var(--clr-ash-200)' }}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => {
                          const newLinks = content.nav.links.filter((_, i) => i !== idx);
                          updateContent({ ...content, nav: { ...content.nav, links: newLinks } });
                        }}
                        style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-fire-crimson)', cursor: 'pointer', color: 'var(--clr-fire-red)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateContent({
                      ...content,
                      nav: { ...content.nav, links: [...content.nav.links, { label: 'New Link', href: '#contact' }] }
                    });
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--clr-primary)',
                    color: 'var(--clr-primary)',
                    padding: '8px 16px',
                    fontFamily: 'var(--font-cond)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px'
                  }}
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Action Button Label</label>
                  <input
                    type="text"
                    value={content.nav.ctaLabel}
                    onChange={(e) => updateContent({ ...content, nav: { ...content.nav, ctaLabel: e.target.value } })}
                    className="admin-input"
                    style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Action Button Href</label>
                  <input
                    type="text"
                    value={content.nav.ctaHref}
                    onChange={(e) => updateContent({ ...content, nav: { ...content.nav, ctaHref: e.target.value } })}
                    className="admin-input"
                    style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* C. HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Hero Banner Customization
              </h2>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Hero Eyebrow Text</label>
                <input
                  type="text"
                  value={content.hero.eyebrow}
                  onChange={(e) => updateContent({ ...content, hero: { ...content.hero, eyebrow: e.target.value } })}
                  className="admin-input"
                  style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                />
                <SpaceHint />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Heading Line 1 (Standard)</label>
                  <input
                    type="text"
                    value={content.hero.headingLine1}
                    onChange={(e) => updateContent({ ...content, hero: { ...content.hero, headingLine1: e.target.value } })}
                    className="admin-input"
                    style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                  />
                  <SpaceHint />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Heading Line 2 (Highlighted Gradient)</label>
                  <input
                    type="text"
                    value={content.hero.headingLine2}
                    onChange={(e) => updateContent({ ...content, hero: { ...content.hero, headingLine2: e.target.value } })}
                    className="admin-input"
                    style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                  />
                  <SpaceHint />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Heading Line 3 (Standard)</label>
                  <input
                    type="text"
                    value={content.hero.headingLine3}
                    onChange={(e) => updateContent({ ...content, hero: { ...content.hero, headingLine3: e.target.value } })}
                    className="admin-input"
                    style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                  />
                  <SpaceHint />
                </div>
              </div>

              {/* Heading preview */}
              <div style={{ background: 'var(--clr-ash-800)', padding: '16px 24px', borderRadius: '4px', border: '1px dashed var(--clr-border)', marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--clr-ash-400)' }}>Heading Assembler Preview:</span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', marginTop: '8px', lineHeight: 1.2 }}>
                  {content.hero.headingLine1}{' '}
                  <span style={{ background: 'linear-gradient(135deg, var(--clr-fire-orange), var(--clr-fire-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {content.hero.headingLine2}
                  </span>{' '}
                  {content.hero.headingLine3}
                </div>
              </div>

              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Supporting Subtext</label>
                <textarea
                  value={content.hero.subtext}
                  onChange={(e) => updateContent({ ...content, hero: { ...content.hero, subtext: e.target.value } })}
                  className="admin-textarea"
                  style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px', resize: 'vertical', minHeight: '100px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Primary Action Button text</label>
                  <input
                    type="text"
                    value={content.hero.ctaPrimaryLabel}
                    onChange={(e) => updateContent({ ...content, hero: { ...content.hero, ctaPrimaryLabel: e.target.value } })}
                    className="admin-input"
                    style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Primary Action Target Href</label>
                  <input
                    type="text"
                    value={content.hero.ctaPrimaryHref}
                    onChange={(e) => updateContent({ ...content, hero: { ...content.hero, ctaPrimaryHref: e.target.value } })}
                    className="admin-input"
                    style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Secondary Action Button text</label>
                  <input
                    type="text"
                    value={content.hero.ctaSecondaryLabel}
                    onChange={(e) => updateContent({ ...content, hero: { ...content.hero, ctaSecondaryLabel: e.target.value } })}
                    className="admin-input"
                    style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Secondary Action Target Href</label>
                  <input
                    type="text"
                    value={content.hero.ctaSecondaryHref}
                    onChange={(e) => updateContent({ ...content, hero: { ...content.hero, ctaSecondaryHref: e.target.value } })}
                    className="admin-input"
                    style={{ width: '100%', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* D. TICKER BAND SECTION */}
          {activeSection === 'ticker' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Scrolling Announcement Ticker Configuration
              </h2>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label" style={{ display: 'block', fontFamily: 'var(--font-cond)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-ash-400)', marginBottom: '8px' }}>Horizontal Scroll Speed Duration (Seconds)</label>
                <input
                  type="number"
                  value={content.ticker.speed}
                  onChange={(e) => updateContent({ ...content, ticker: { ...content.ticker, speed: Number(e.target.value) || 25 } })}
                  className="admin-input"
                  style={{ width: '100px', background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                />
              </div>

              <div style={{ margin: '32px 0 24px 0' }}>
                <h3 style={{ fontFamily: 'var(--font-cond)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-white)', marginBottom: '16px' }}>Ticker Pill Items</h3>
                {content.ticker.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...content.ticker.items];
                        newItems[idx] = e.target.value;
                        updateContent({ ...content, ticker: { ...content.ticker, items: newItems } });
                      }}
                      className="admin-input"
                      style={{ flex: 1, background: 'var(--clr-ash-700)', border: '1px solid rgba(232,97,10,0.15)', color: 'var(--clr-ash-100)', padding: '10px 14px', borderRadius: '2px' }}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => {
                          if (idx > 0) {
                            const newItems = [...content.ticker.items];
                            const temp = newItems[idx];
                            newItems[idx] = newItems[idx - 1];
                            newItems[idx - 1] = temp;
                            updateContent({ ...content, ticker: { ...content.ticker, items: newItems } });
                          }
                        }}
                        style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-border)', cursor: 'pointer', color: 'var(--clr-ash-200)' }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (idx < content.ticker.items.length - 1) {
                            const newItems = [...content.ticker.items];
                            const temp = newItems[idx];
                            newItems[idx] = newItems[idx + 1];
                            newItems[idx + 1] = temp;
                            updateContent({ ...content, ticker: { ...content.ticker, items: newItems } });
                          }
                        }}
                        style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-border)', cursor: 'pointer', color: 'var(--clr-ash-200)' }}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => {
                          const newItems = content.ticker.items.filter((_, i) => i !== idx);
                          updateContent({ ...content, ticker: { ...content.ticker, items: newItems } });
                        }}
                        style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-fire-crimson)', cursor: 'pointer', color: 'var(--clr-fire-red)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateContent({
                      ...content,
                      ticker: { ...content.ticker, items: [...content.ticker.items, 'New Express Service'] }
                    });
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--clr-primary)',
                    color: 'var(--clr-primary)',
                    padding: '8px 16px',
                    fontFamily: 'var(--font-cond)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px'
                  }}
                >
                  <Plus size={14} /> Add Ticker Item
                </button>
              </div>
            </div>
          )}

          {/* E. SERVICES GRID SECTION */}
          {activeSection === 'services' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Services Grid Management
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">Section Eyebrow</label>
                  <input
                    type="text"
                    value={content.services.eyebrow}
                    onChange={(e) => updateContent({ ...content, services: { ...content.services, eyebrow: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Heading Standard</label>
                  <input
                    type="text"
                    value={content.services.title}
                    onChange={(e) => updateContent({ ...content, services: { ...content.services, title: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Heading Highlight</label>
                  <input
                    type="text"
                    value={content.services.titleHighlight}
                    onChange={(e) => updateContent({ ...content, services: { ...content.services, titleHighlight: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-field-group" style={{ marginBottom: '32px' }}>
                <label className="admin-label">Section Subtitle description</label>
                <input
                  type="text"
                  value={content.services.subtitle}
                  onChange={(e) => updateContent({ ...content, services: { ...content.services, subtitle: e.target.value } })}
                  className="admin-input"
                />
              </div>

              {/* List of services cards */}
              <div style={{ margin: '32px 0 24px 0' }}>
                <h3 style={{ fontFamily: 'var(--font-cond)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-white)', marginBottom: '16px' }}>Service Offering Cards</h3>
                {content.services.items.map((service, idx) => (
                  <div key={service.id} style={{ background: 'var(--clr-ash-800)', border: '1px solid var(--clr-border)', padding: '24px', borderRadius: '4px', marginBottom: '20px', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ width: '80px' }}>
                        <label className="admin-label">Icon</label>
                        <input
                          type="text"
                          value={service.icon}
                          onChange={(e) => {
                            const newServices = [...content.services.items];
                            newServices[idx].icon = e.target.value;
                            updateContent({ ...content, services: { ...content.services, items: newServices } });
                          }}
                          className="admin-input"
                          style={{ textAlign: 'center', fontSize: '20px' }}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <label className="admin-label">Service Title</label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => {
                              const newServices = [...content.services.items];
                              newServices[idx].title = e.target.value;
                              updateContent({ ...content, services: { ...content.services, items: newServices } });
                            }}
                            className="admin-input"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className="admin-label">Card Image URL</label>
                          <input
                            type="text"
                            value={service.imageUrl || ''}
                            onChange={(e) => {
                              const newServices = [...content.services.items];
                              newServices[idx].imageUrl = e.target.value;
                              updateContent({ ...content, services: { ...content.services, items: newServices } });
                            }}
                            className="admin-input"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (idx > 0) {
                                const newServices = [...content.services.items];
                                const temp = newServices[idx];
                                newServices[idx] = newServices[idx - 1];
                                newServices[idx - 1] = temp;
                                updateContent({ ...content, services: { ...content.services, items: newServices } });
                              }
                            }}
                            style={{ padding: '6px', background: 'none', border: '1px solid var(--clr-border)', cursor: 'pointer', color: 'var(--clr-ash-200)' }}
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (idx < content.services.items.length - 1) {
                                const newServices = [...content.services.items];
                                const temp = newServices[idx];
                                newServices[idx] = newServices[idx + 1];
                                newServices[idx + 1] = temp;
                                updateContent({ ...content, services: { ...content.services, items: newServices } });
                              }
                            }}
                            style={{ padding: '6px', background: 'none', border: '1px solid var(--clr-border)', cursor: 'pointer', color: 'var(--clr-ash-200)' }}
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newServices = content.services.items.filter((_, i) => i !== idx);
                              updateContent({ ...content, services: { ...content.services, items: newServices } });
                            }}
                            style={{ padding: '6px', background: 'none', border: '1px solid var(--clr-fire-crimson)', cursor: 'pointer', color: 'var(--clr-fire-red)' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--clr-ash-400)', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={service.visible}
                            onChange={(e) => {
                              const newServices = [...content.services.items];
                              newServices[idx].visible = e.target.checked;
                              updateContent({ ...content, services: { ...content.services, items: newServices } });
                            }}
                          />
                          Visible
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="admin-label">Service Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...content.services.items];
                          newServices[idx].description = e.target.value;
                          updateContent({ ...content, services: { ...content.services, items: newServices } });
                        }}
                        className="admin-textarea"
                        style={{ minHeight: '60px' }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const nextId = `s${Date.now()}`;
                    updateContent({
                      ...content,
                      services: {
                        ...content.services,
                        items: [
                          ...content.services.items,
                          { id: nextId, icon: '📦', title: 'New Specialized Logistics', description: 'Description of specialized shipping compliance clearance and transport capabilities.', imageUrl: '', visible: true }
                        ]
                      }
                    });
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--clr-primary)',
                    color: 'var(--clr-primary)',
                    padding: '8px 16px',
                    fontFamily: 'var(--font-cond)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} /> Add Service Card
                </button>
              </div>
            </div>
          )}

          {/* F. ABOUT US SECTION */}
          {activeSection === 'about' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                About Us Section content
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">About Eyebrow</label>
                  <input
                    type="text"
                    value={content.about.eyebrow}
                    onChange={(e) => updateContent({ ...content, about: { ...content.about, eyebrow: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Establishment Badge Text</label>
                  <input
                    type="text"
                    value={content.about.badge}
                    onChange={(e) => updateContent({ ...content, about: { ...content.about, badge: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">Heading Line 1</label>
                  <input
                    type="text"
                    value={content.about.headingLine1}
                    onChange={(e) => updateContent({ ...content, about: { ...content.about, headingLine1: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Heading Line 2 (Highlight)</label>
                  <input
                    type="text"
                    value={content.about.headingLine2}
                    onChange={(e) => updateContent({ ...content, about: { ...content.about, headingLine2: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label">About Subtext</label>
                <textarea
                  value={content.about.subtext}
                  onChange={(e) => updateContent({ ...content, about: { ...content.about, subtext: e.target.value } })}
                  className="admin-textarea"
                />
              </div>

              {/* Feature bullet list */}
              <div style={{ margin: '32px 0 24px 0' }}>
                <h3 style={{ fontFamily: 'var(--font-cond)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-white)', marginBottom: '16px' }}>Bullet Features</h3>
                {content.about.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const newFeats = [...content.about.features];
                        newFeats[idx] = e.target.value;
                        updateContent({ ...content, about: { ...content.about, features: newFeats } });
                      }}
                      className="admin-input"
                      style={{ flex: 1 }}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (idx > 0) {
                            const newFeats = [...content.about.features];
                            const temp = newFeats[idx];
                            newFeats[idx] = newFeats[idx - 1];
                            newFeats[idx - 1] = temp;
                            updateContent({ ...content, about: { ...content.about, features: newFeats } });
                          }
                        }}
                        style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-border)', cursor: 'pointer', color: 'var(--clr-ash-200)' }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (idx < content.about.features.length - 1) {
                            const newFeats = [...content.about.features];
                            const temp = newFeats[idx];
                            newFeats[idx] = newFeats[idx + 1];
                            newFeats[idx + 1] = temp;
                            updateContent({ ...content, about: { ...content.about, features: newFeats } });
                          }
                        }}
                        style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-border)', cursor: 'pointer', color: 'var(--clr-ash-200)' }}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newFeats = content.about.features.filter((_, i) => i !== idx);
                          updateContent({ ...content, about: { ...content.about, features: newFeats } });
                        }}
                        style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-fire-crimson)', cursor: 'pointer', color: 'var(--clr-fire-red)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateContent({
                      ...content,
                      about: { ...content.about, features: [...content.about.features, 'New premium logistics feature bullet.'] }
                    });
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--clr-primary)',
                    color: 'var(--clr-primary)',
                    padding: '8px 16px',
                    fontFamily: 'var(--font-cond)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px'
                  }}
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">Action CTA Button Text</label>
                  <input
                    type="text"
                    value={content.about.ctaLabel}
                    onChange={(e) => updateContent({ ...content, about: { ...content.about, ctaLabel: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Action Target Link Href</label>
                  <input
                    type="text"
                    value={content.about.ctaHref}
                    onChange={(e) => updateContent({ ...content, about: { ...content.about, ctaHref: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-field-group">
                <label className="admin-label">About Badge Tagline</label>
                <input
                  type="text"
                  value={content.about.tagline}
                  onChange={(e) => updateContent({ ...content, about: { ...content.about, tagline: e.target.value } })}
                  className="admin-input"
                />
                <SpaceHint />
              </div>
            </div>
          )}

          {/* G. STATS COUNTER SECTION */}
          {activeSection === 'stats' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Stats Counters Configuration
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {content.stats.items.map((stat, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', background: 'var(--clr-ash-800)', padding: '20px', borderRadius: '4px', border: '1px solid var(--clr-border)' }}>
                    <div>
                      <label className="admin-label">Stat Value / Number</label>
                      <input
                        type="text"
                        value={stat.number}
                        onChange={(e) => {
                          const newStats = [...content.stats.items];
                          newStats[idx].number = e.target.value;
                          updateContent({ ...content, stats: { ...content.stats, items: newStats } });
                        }}
                        className="admin-input"
                        style={{ fontSize: '18px', fontWeight: 'bold' }}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Stat Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...content.stats.items];
                          newStats[idx].label = e.target.value;
                          updateContent({ ...content, stats: { ...content.stats, items: newStats } });
                        }}
                        className="admin-input"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* H. WHY CHOOSE US SECTION */}
          {activeSection === 'whyUs' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Why Choose Us Section
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">Section Eyebrow</label>
                  <input
                    type="text"
                    value={content.whyUs.eyebrow}
                    onChange={(e) => updateContent({ ...content, whyUs: { ...content.whyUs, eyebrow: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Title Standard</label>
                  <input
                    type="text"
                    value={content.whyUs.title}
                    onChange={(e) => updateContent({ ...content, whyUs: { ...content.whyUs, title: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Title Highlighted</label>
                  <input
                    type="text"
                    value={content.whyUs.titleHighlight}
                    onChange={(e) => updateContent({ ...content, whyUs: { ...content.whyUs, titleHighlight: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ margin: '32px 0 24px 0' }}>
                <h3 style={{ fontFamily: 'var(--font-cond)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-white)', marginBottom: '16px' }}>Feature Highlight Cards</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {content.whyUs.items.map((item, idx) => (
                    <div key={idx} style={{ background: 'var(--clr-ash-800)', border: '1px solid var(--clr-border)', padding: '20px', borderRadius: '4px', display: 'flex', gap: '16px' }}>
                      <div style={{ width: '80px' }}>
                        <label className="admin-label">Icon / Emoji</label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => {
                            const newItems = [...content.whyUs.items];
                            newItems[idx].icon = e.target.value;
                            updateContent({ ...content, whyUs: { ...content.whyUs, items: newItems } });
                          }}
                          className="admin-input"
                          style={{ textAlign: 'center' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            placeholder="Title"
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [...content.whyUs.items];
                              newItems[idx].title = e.target.value;
                              updateContent({ ...content, whyUs: { ...content.whyUs, items: newItems } });
                            }}
                            className="admin-input"
                            style={{ flex: 1 }}
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...content.whyUs.items];
                              newItems[idx].description = e.target.value;
                              updateContent({ ...content, whyUs: { ...content.whyUs, items: newItems } });
                            }}
                            className="admin-input"
                            style={{ flex: 2 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* I. CTA BAND SECTION */}
          {activeSection === 'cta' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Call To Action (CTA) Banner Customization
              </h2>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label">CTA Banner Headline</label>
                <input
                  type="text"
                  value={content.cta.heading}
                  onChange={(e) => updateContent({ ...content, cta: { ...content.cta, heading: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label">CTA Banner Subtext</label>
                <input
                  type="text"
                  value={content.cta.subtext}
                  onChange={(e) => updateContent({ ...content, cta: { ...content.cta, subtext: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">Button Text Label</label>
                  <input
                    type="text"
                    value={content.cta.buttonLabel}
                    onChange={(e) => updateContent({ ...content, cta: { ...content.cta, buttonLabel: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Button Href Link</label>
                  <input
                    type="text"
                    value={content.cta.buttonHref}
                    onChange={(e) => updateContent({ ...content, cta: { ...content.cta, buttonHref: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* J. CONTACT & DUAL ADDRESS SECTION */}
          {activeSection === 'contact' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Contact Forms & Dual Office Addresses
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">Contact Eyebrow</label>
                  <input
                    type="text"
                    value={content.contact.eyebrow}
                    onChange={(e) => updateContent({ ...content, contact: { ...content.contact, eyebrow: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Title Standard</label>
                  <input
                    type="text"
                    value={content.contact.title}
                    onChange={(e) => updateContent({ ...content, contact: { ...content.contact, title: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Title Highlighted</label>
                  <input
                    type="text"
                    value={content.contact.titleHighlight}
                    onChange={(e) => updateContent({ ...content, contact: { ...content.contact, titleHighlight: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label">Supporting Form Subtitle</label>
                <input
                  type="text"
                  value={content.contact.subtitle}
                  onChange={(e) => updateContent({ ...content, contact: { ...content.contact, subtitle: e.target.value } })}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">Office Operations Hotline Phone</label>
                  <input
                    type="text"
                    value={content.contact.phone}
                    onChange={(e) => updateContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label" style={{ color: 'var(--clr-fire-red)' }}>Emergency Dispatch Phone</label>
                  <input
                    type="text"
                    value={content.contact.emergencyPhone}
                    onChange={(e) => updateContent({ ...content, contact: { ...content.contact, emergencyPhone: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">Company Email</label>
                  <input
                    type="text"
                    value={content.contact.email}
                    onChange={(e) => updateContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Working Hours Text</label>
                  <input
                    type="text"
                    value={content.contact.workingHours}
                    onChange={(e) => updateContent({ ...content, contact: { ...content.contact, workingHours: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Form Quote Recipient Email</label>
                  <input
                    type="text"
                    value={content.contact.formRecipientEmail}
                    onChange={(e) => updateContent({ ...content, contact: { ...content.contact, formRecipientEmail: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>

              {/* DUAL OFFICE ADDRESS CONFIGURATION */}
              <h3 style={{ fontFamily: 'var(--font-cond)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-white)', marginBottom: '16px' }}>Dual Offices Configuration</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Office 1: Corporate */}
                <div style={{ background: 'var(--clr-ash-800)', border: '1px solid var(--clr-primary)', padding: '24px', borderRadius: '4px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--clr-fire-orange)', fontWeight: 700 }}>Corporate Office Address (Accent Border)</span>
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label className="admin-label">Address Label Header</label>
                      <input
                        type="text"
                        value={content.contact.addresses[0].label}
                        onChange={(e) => {
                          const newAddrs = [...content.contact.addresses];
                          newAddrs[0].label = e.target.value;
                          updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Street Address Line 1</label>
                      <input
                        type="text"
                        value={content.contact.addresses[0].line1}
                        onChange={(e) => {
                          const newAddrs = [...content.contact.addresses];
                          newAddrs[0].line1 = e.target.value;
                          updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Street Address Line 2</label>
                      <input
                        type="text"
                        value={content.contact.addresses[0].line2}
                        onChange={(e) => {
                          const newAddrs = [...content.contact.addresses];
                          newAddrs[0].line2 = e.target.value;
                          updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="admin-label">City Zone</label>
                        <input
                          type="text"
                          value={content.contact.addresses[0].city}
                          onChange={(e) => {
                            const newAddrs = [...content.contact.addresses];
                            newAddrs[0].city = e.target.value;
                            updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                          }}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Country</label>
                        <input
                          type="text"
                          value={content.contact.addresses[0].country}
                          onChange={(e) => {
                            const newAddrs = [...content.contact.addresses];
                            newAddrs[0].country = e.target.value;
                            updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                          }}
                          className="admin-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Office 2: Operations Branch */}
                <div style={{ background: 'var(--clr-ash-800)', border: '1px solid var(--clr-border)', padding: '24px', borderRadius: '4px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--clr-ash-200)', fontWeight: 700 }}>Operations Branch Address (Muted Border)</span>
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label className="admin-label">Address Label Header</label>
                      <input
                        type="text"
                        value={content.contact.addresses[1].label}
                        onChange={(e) => {
                          const newAddrs = [...content.contact.addresses];
                          newAddrs[1].label = e.target.value;
                          updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Street Address Line 1</label>
                      <input
                        type="text"
                        value={content.contact.addresses[1].line1}
                        onChange={(e) => {
                          const newAddrs = [...content.contact.addresses];
                          newAddrs[1].line1 = e.target.value;
                          updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Street Address Line 2</label>
                      <input
                        type="text"
                        value={content.contact.addresses[1].line2}
                        onChange={(e) => {
                          const newAddrs = [...content.contact.addresses];
                          newAddrs[1].line2 = e.target.value;
                          updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="admin-label">City Zone</label>
                        <input
                          type="text"
                          value={content.contact.addresses[1].city}
                          onChange={(e) => {
                            const newAddrs = [...content.contact.addresses];
                            newAddrs[1].city = e.target.value;
                            updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                          }}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Country</label>
                        <input
                          type="text"
                          value={content.contact.addresses[1].country}
                          onChange={(e) => {
                            const newAddrs = [...content.contact.addresses];
                            newAddrs[1].country = e.target.value;
                            updateContent({ ...content, contact: { ...content.contact, addresses: newAddrs } });
                          }}
                          className="admin-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* K. FOOTER SETTINGS SECTION */}
          {activeSection === 'footer' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Footer Customization
              </h2>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label">Footer Tagline</label>
                <input
                  type="text"
                  value={content.footer.tagline}
                  onChange={(e) => updateContent({ ...content, footer: { ...content.footer, tagline: e.target.value } })}
                  className="admin-input"
                />
                <SpaceHint />
              </div>
              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-label">Footer Description Copy</label>
                <textarea
                  value={content.footer.description}
                  onChange={(e) => updateContent({ ...content, footer: { ...content.footer, description: e.target.value } })}
                  className="admin-textarea"
                />
              </div>

              {/* Certifications plain text list */}
              <div style={{ margin: '32px 0 24px 0' }}>
                <h3 style={{ fontFamily: 'var(--font-cond)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-white)', marginBottom: '16px' }}>Compliance Certifications</h3>
                {content.footer.certifications.map((cert, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => {
                        const newCerts = [...content.footer.certifications];
                        newCerts[idx] = e.target.value;
                        updateContent({ ...content, footer: { ...content.footer, certifications: newCerts } });
                      }}
                      className="admin-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      onClick={() => {
                        const newCerts = content.footer.certifications.filter((_, i) => i !== idx);
                        updateContent({ ...content, footer: { ...content.footer, certifications: newCerts } });
                      }}
                      style={{ padding: '8px', background: 'none', border: '1px solid var(--clr-fire-crimson)', cursor: 'pointer', color: 'var(--clr-fire-red)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateContent({
                      ...content,
                      footer: { ...content.footer, certifications: [...content.footer.certifications, 'New Certification'] }
                    });
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--clr-primary)',
                    color: 'var(--clr-primary)',
                    padding: '8px 16px',
                    fontFamily: 'var(--font-cond)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px'
                  }}
                >
                  <Plus size={14} /> Add Certification
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-field-group">
                  <label className="admin-label">Copyright notice text</label>
                  <input
                    type="text"
                    value={content.footer.copyrightText}
                    onChange={(e) => updateContent({ ...content, footer: { ...content.footer, copyrightText: e.target.value } })}
                    className="admin-input"
                  />
                  <SpaceHint />
                </div>
                <div className="admin-field-group">
                  <label className="admin-label">Footer badge note</label>
                  <input
                    type="text"
                    value={content.footer.footerBadge}
                    onChange={(e) => updateContent({ ...content, footer: { ...content.footer, footerBadge: e.target.value } })}
                    className="admin-input"
                  />
                  <SpaceHint />
                </div>
              </div>

              <div className="admin-field-group">
                <label className="admin-label">Footer branding credit note</label>
                <input
                  type="text"
                  value={content.footer.footerNote}
                  onChange={(e) => updateContent({ ...content, footer: { ...content.footer, footerNote: e.target.value } })}
                  className="admin-input"
                />
              </div>
            </div>
          )}

          {/* L. ADMIN SECURITY PASSWORD SECTION */}
          {activeSection === 'password' && (
            <div className="reveal visible">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase', borderBottom: '1px solid rgba(232,97,10,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                Manage Admin Authentication Password
              </h2>
              <div style={{ background: 'var(--clr-ash-800)', border: '1px solid var(--clr-border)', padding: '24px', borderRadius: '4px', maxWidth: '500px' }}>
                <p style={{ fontSize: '14px', color: 'var(--clr-ash-100)', marginBottom: '16px', lineHeight: 1.6 }}>
                  Authentication is powered by <strong>Firebase Auth</strong>. To change the password for the current account (<strong>{user?.email}</strong>), click the button below to send a secure password reset link to your email address.
                </p>
                <button
                  type="button"
                  disabled={resetSending}
                  onClick={async () => {
                    if (!user?.email) return;
                    setResetSending(true);
                    try {
                      await resetPassword(user.email);
                      toast.success('Password reset email sent successfully!');
                    } catch (err: any) {
                      console.error(err);
                      toast.error(err.message || 'Failed to send password reset email');
                    } finally {
                      setResetSending(false);
                    }
                  }}
                  className="btn-primary"
                  style={{
                    background: 'var(--clr-fire-orange)',
                    border: 'none',
                    color: 'var(--clr-white)',
                    padding: '12px 24px',
                    fontFamily: 'var(--font-cond)',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 700,
                    borderRadius: '2px',
                    cursor: resetSending ? 'not-allowed' : 'pointer',
                    opacity: resetSending ? 0.7 : 1
                  }}
                >
                  {resetSending ? 'Sending Link...' : 'Send Password Reset Email'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
