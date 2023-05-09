from setuptools import setup, find_namespace_packages
from setup_helper import find_all_resource_files

# -- Apps Definition -- #
namespace = 'tethysapp'
app_package = 'water_data_explorer'
release_package = 'tethysapp-' + app_package

# -- Python Dependencies -- #
dependencies = []

# -- Get Resource File -- #
resource_files = find_all_resource_files(app_package, namespace)




setup(
    name=release_package,
    version='1.1.19',
    description='A tethys app that lets the user to visualize and query WSDL enpoints',
    long_description='',
    keywords='',
    author='Giovanni Romero Bustamante',
    author_email='gio.rombus@gmail.com',
    url='https://github.com/BYU-Hydroinformatics/Water-Data-Explorer',
    license='BSD 3-Clause License',
    packages=find_namespace_packages(),
    package_data={'': resource_files},
    include_package_data=True,
    zip_safe=False,
    install_requires=dependencies,
)
