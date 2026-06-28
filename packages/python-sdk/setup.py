from setuptools import setup, find_packages

setup(
    name="psti-sdk",
    version="0.1.0",
    description="Python SDK for the psti.io API",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.1",
    ],
    extras_require={
        "dev": [
            "pytest>=6.0.0",
            "responses>=0.18.0",
        ]
    },
    python_requires=">=3.8",
)
