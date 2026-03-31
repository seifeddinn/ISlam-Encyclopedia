import os
import codecs

ultimate_css = """
<!-- ULTIMATE MOBILE RESPONSIVE FIX -->
<style id="ultimate-mobile-fix">
@media (max-width: 768px) {
    /* 1. Nuke horizontal scrolling and force viewport width */
    html, body { width: 100% !important; max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 2. Scale down ALL large headings forcefully across any hero class */
    h1, .display-1, .display-2, .display-3, .display-4, div[class*="hero"] h1, section[class*="hero"] h1 {
        font-size: clamp(1.8rem, 8vw, 2.5rem) !important;
        line-height: 1.4 !important;
    }
    h2, section h2 { font-size: 1.5rem !important; line-height: 1.4 !important; }
    h3, section h3 { font-size: 1.3rem !important; }
    
    /* 3. Nuke massive padding safely for all hero and section blocks */
    section, div[class*="hero"], header, .mega-footer {
        padding-top: min(40px, 10%) !important;
        padding-bottom: min(40px, 10%) !important;
        padding-left: 15px !important;
        padding-right: 15px !important;
        min-height: auto !important;
        margin-top: 0 !important;
    }
    
    /* 4. Fix Container and Row paddings to prevent overflow */
    .container { padding-left: 15px !important; padding-right: 15px !important; width: 100% !important; max-width: 100% !important; }
    .row { margin-left: 0 !important; margin-right: 0 !important; }
    .col, [class*="col-"] { padding-left: 0 !important; padding-right: 0 !important; width: 100% !important; }
    
    /* 5. Force ALL Grids to 1 column on mobile */
    div[style*="grid"], div[class*="grid"] {
        display: flex !important;
        flex-direction: column !important;
        gap: 15px !important;
    }
    
    /* 6. Hide absolutely positioned decorative backgrounds that cause stretch and lag */
    .orb, [class*="-orb"], .hero-pattern, div[class*="bg-shape"] { display: none !important; }
    
    /* 7. Ensure buttons aren't huge */
    .btn:not(.contact-btn) { display: block !important; width: 100% !important; margin-bottom: 10px !important; padding: 12px !important; }
    .contact-btn { width: 50px !important; height: 50px !important; font-size: 1.2rem !important; display: inline-flex !important; }
    
    /* 8. Fix specific cards padding (often coded 40px/60px padding) */
    div[class*="card"], div[class*="box"], div[class*="glass"], div[class*="widget"] {
        padding: 20px 15px !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin-bottom: 20px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        border-radius: 12px !important;
    }
    
    /* 9. Navbar tweaks */
    .navbar-collapse { background: rgba(11,25,44,0.95) !important; backdrop-filter: blur(10px); padding: 15px !important; border-radius: 10px !important; margin-top: 10px !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .nav-link { border-bottom: 1px solid rgba(255,255,255,0.05); padding: 12px 10px !important; }
    .navbar-brand { font-size: 1.4rem !important; }
    
    /* 10. Forms */
    form { padding: 0 !important; }
    input, textarea { width: 100% !important; }
    
    /* 11. Images and media */
    img, video, iframe, table { max-width: 100% !important; height: auto !important; }
    
    /* 12. Flex lists like social icons */
    .d-flex.justify-content-center { flex-wrap: wrap !important; gap: 10px !important; }
    
    /* 13. Tree/Mind map specifics */
    .mind-branches { flex-direction: column !important; }
    .mind-branch { border: none !important; padding: 0 !important; margin-bottom: 10px; width: 100% !important; }
}
</style>
</head>
"""

count = 0
for f in os.listdir('.'):
    if f.endswith('.html'):
        with codecs.open(f, 'r', 'utf-8') as file:
            content = file.read()
            
        if "ULTIMATE MOBILE RESPONSIVE FIX" not in content and "</head>" in content:
            # We insert it right before </head> so it has the highest specificity internally
            content = content.replace("</head>", ultimate_css)
            
            with codecs.open(f, 'w', 'utf-8') as file:
                file.write(content)
            count += 1
            print(f"Applied ultimate responsive fix to {f}")

print(f"Done for {count} files.")
