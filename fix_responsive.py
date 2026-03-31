import os, re

pages = [
    'index.html', 'recitations.html', 'aqeedah.html', 'fiqh.html',
    'hadith.html', 'history.html', 'seerah.html', 'fatwa.html',
    'library.html', 'contact.html', 'login.html', 'register.html',
    'search.html', 'share.html', 'usul.html', '404.html',
    'fiqh_hanafi.html', 'fiqh_hanbali.html', 'fiqh_maliki.html', 'fiqh_shafi.html'
]

folder = r'C:\Users\ST\Desktop\islamic.encyclopedia'
fa_link = 'href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"'
responsive_link_tag = '\n<link rel="stylesheet" href="responsive.css">'

ok, skip, err = [], [], []

for page in pages:
    path = os.path.join(folder, page)
    if not os.path.exists(path):
        skip.append(page + ' (not found)')
        continue

    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Remove Block 1: MEGA MOBILE RESPONSIVE FIXES
        content = re.sub(
            r'\n?<!-- MEGA MOBILE RESPONSIVE FIXES -->[\s\S]*?</style>',
            '',
            content,
            count=1
        )

        # Remove Block 2: ULTIMATE MOBILE RESPONSIVE FIX
        content = re.sub(
            r'\n?<!-- ULTIMATE MOBILE RESPONSIVE FIX -->[\s\S]*?</style>',
            '',
            content,
            count=1
        )

        # Add responsive.css link if not present
        if 'responsive.css' not in content:
            if fa_link in content:
                # Find the full <link> tag containing fa_link and append after it
                content = re.sub(
                    r'(<link[^>]+' + re.escape(fa_link) + r'[^>]*>)',
                    r'\1' + responsive_link_tag,
                    content,
                    count=1
                )
            else:
                content = content.replace('</head>', responsive_link_tag + '\n</head>', 1)

        has_responsive = 'responsive.css' in content
        removed_old = ('MEGA MOBILE RESPONSIVE' not in content) and ('ultimate-mobile-fix' not in content)
        status = 'OK' if (has_responsive and removed_old) else 'PARTIAL'

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f'[{status}] {page}  | css={has_responsive} old_removed={removed_old}')
        if status == 'OK':
            ok.append(page)
        else:
            skip.append(page)

    except Exception as e:
        err.append(page)
        print(f'[ERR] {page}: {e}')

print()
print(f'FULLY UPDATED : {len(ok)}')
print(f'PARTIAL/SKIP  : {len(skip)}')
print(f'ERRORS        : {len(err)}')
