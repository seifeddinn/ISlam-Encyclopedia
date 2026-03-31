import os
import re
import codecs

mobile_fixes_css = """
<!-- MEGA MOBILE RESPONSIVE FIXES -->
<style>
@media (max-width: 991px) {
    .stats-mega .stat-box { margin-bottom: 20px; border-left: none !important; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 20px; }
    .stats-mega .stat-box:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
}
@media (max-width: 768px) {
    html, body { overflow-x: hidden !important; width: 100%; max-width: 100%; }
    .mega-hero { padding: 60px 15px !important; min-height: auto !important; }
    .hero-glass { padding: 30px 20px !important; border-radius: 20px !important; width: 100% !important; }
    .mega-hero h1 { font-size: 2.2rem !important; line-height: 1.4 !important; }
    .hero-eyebrow { font-size: 0.85rem !important; padding: 6px 20px !important; }
    .tagline { font-size: 1rem !important; line-height: 1.8 !important; }
    
    .orb { display: none !important; } /* Hide decorative orbs to prevent screen stretch issues */
    
    .sec-head h3 { font-size: 1.8rem !important; }
    .sec-head p { font-size: 1rem !important; }
    
    .stat-num { font-size: 2.2rem !important; }
    
    .main-tabs-wrapper { margin: 20px 10px 30px !important; padding: 10px !important; top: 60px !important; border-radius: 12px !important; }
    .main-tabs .nav-link { font-size: 0.9rem !important; padding: 10px 15px !important; border-radius: 8px !important; }
    
    .mega-footer { padding: 40px 15px 20px !important; margin-top: 40px !important; }
    
    .cat-grid, .names-grid { grid-template-columns: 1fr !important; gap: 15px !important; margin-top: -30px !important; }
    
    .belief-box, .rule-card { padding: 20px !important; border-radius: 15px !important; border-right: 3px solid var(--primary) !important; border-left: none !important;}
    
    .battle-card { padding: 20px !important; margin-bottom: 20px !important; text-align: center !important;}
    .battle-sword { font-size: 6rem !important; }
    
    .mega-cat-card, .scholar-quote { padding: 25px 15px !important; }
    .s-text { font-size: 1.1rem !important; line-height: 1.8 !important; }
    
    .mind-node { width: 100% !important; margin-bottom: 15px !important; }
    .mind-branches { flex-direction: column !important; gap: 10px !important; padding-top: 20px !important; }
    .mind-branches::before, .mind-branches::after, .mind-branch::before { display: none !important; }
    
    /* Specific overrides for pages with massive elements */
    .books-grid { grid-template-columns: 1fr !important; }
    .fiqh-level-card { border-radius: 15px !important; padding: 20px !important; }
    .fatwa-box { padding: 20px !important; margin: 15px 0 !important; }
    .player-container { padding: 15px !important; flex-direction: column !important; text-align: center !important; }
    .btn-lg { padding: 10px 20px !important; font-size: 1rem !important; }
}

@media (max-width: 400px) {
    .mega-hero h1 { font-size: 1.8rem !important; }
    .navbar-brand { font-size: 1.2rem !important; }
    .sec-head h3 { font-size: 1.5rem !important; }
}
</style>
</head>
"""

count = 0
for f in os.listdir('.'):
    if f.endswith('.html'):
        with codecs.open(f, 'r', 'utf-8') as file:
            content = file.read()
            
        if "MEGA MOBILE RESPONSIVE FIXES" not in content and "</head>" in content:
            content = content.replace("</head>", mobile_fixes_css)
            
            # Additional generic fix: Ensure body has overflow-x hidden for horizontal scrolling bugs.
            if "body{font-family" in content and "overflow-x:hidden;" not in content:
                 content = content.replace("body{", "body{overflow-x:hidden!important;")
            
            with codecs.open(f, 'w', 'utf-8') as file:
                file.write(content)
            count += 1
            print(f"Applied responsive fixes to {f}")

print(f"Finished applying mobile responsiveness to {count} files.")
