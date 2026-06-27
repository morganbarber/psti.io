from setuptools import setup, find_packages

setup(
    name="pastebin-sdk",
    version="0.1.0",
    description="Python SDK for the Pastebin API",
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
