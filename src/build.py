# Builds ../index.html (the whole app in one self-contained file) from the parts in this folder.
# Usage: python src/build.py
import os

HERE = os.path.dirname(os.path.abspath(__file__))
PARTS = ['engine.js', 'samples_data.js', 'modules.js', 'pcap_data.js', 'netlab.js', 'websec.js', 'ui_art.js', 'ui_strings.js',
         'levels.js', 'lab_ui.js', 'websec_ui.js', 'proto_ui.js', 'assistant.js', 'workspace.js']

head = open(os.path.join(HERE, 'proto_head.html'), encoding='utf-8').read()
tpl = open(os.path.join(HERE, 'proto_scripts.tpl'), encoding='utf-8').read()
js = '\n'.join(open(os.path.join(HERE, p), encoding='utf-8').read() for p in PARTS)
js = js.replace('</script', '<\\/script')  # a closing tag inside a JS string must not end the page script
icon = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath d='M24 3 42 9v13c0 11.5-7.7 19.6-18 23C13.7 41.6 6 33.5 6 22V9Z' fill='%230EA5E9'/%3E"
        "%3Cpath d='m16 24 6 6 11-12' stroke='%23fff' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
cut = head.index('</style>') + len('</style>')
doc = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
       '<meta name="author" content="Fabliha Afia">\n<meta name="theme-color" content="#0EA5E9">\n'
       f'<link rel="icon" href="{icon}">\n'
       + head[:cut] + '\n</head>\n<body>\n' + head[cut:] + tpl.replace('/*ENGINE_AND_UI*/', js) + '\n</body>\n</html>\n')
open(os.path.join(HERE, '..', 'index.html'), 'w', encoding='utf-8').write(doc)
print('built index.html', len(doc), 'characters')
