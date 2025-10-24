#!/bin/bash

# Update package list and install necessary packages for ML environment
sudo apt update
sudo apt install -y python3 python3-pip python3-venv

# Create a virtual environment for the ML project
python3 -m venv ml_env

# Activate the virtual environment
source ml_env/bin/activate

# Install required Python packages
pip install numpy pandas scikit-learn tensorflow opencv-python

# Deactivate the virtual environment
deactivate

echo "Machine learning environment setup complete."