import json, glob, os
os.chdir("/Users/gorilapesquisador/Projects/ecossistema")
try:
    import yaml
    have = True
except ImportError:
    have = False
for f in sorted(glob.glob('.github/workflows/*.yml')):
    if have:
        yaml.safe_load(open(f))
        print('yaml ok:', f)
    else:
        print('sem pyyaml — skip:', f)
