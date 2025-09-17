import os

def add_init_py_files(root_dir):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        init_file = os.path.join(dirpath, '__init__.py')
        if not os.path.exists(init_file):
            open(init_file, 'a').close()
            print(f'Added __init__.py to: {dirpath}')


add_init_py_files(".")
