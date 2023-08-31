# Script - Inequality

This is a script that check the inequality of the sale of the marketplace.
More precisely, it checks if the the seller of a token is still the owner. For doing so, the script check every block from the execution start and the current block checking **SaleBought** and **Transfer** event.

If a sale is transferred to another address not throught the marketplace the sale will be deleted.

## Getting Started

1. Set up a virtual environment (optional but recommended) More info [here](https://docs.python.org/3/tutorial/venv.html) and [here](https://virtualenv.pypa.io/en/latest/)

```bash
python -m venv yourEnv
```

2. Activate the virtual environment

For Windows:

```bash
.\yourEnv\Scripts\activate
```

For macOS and Linux:

```bash
source yourEnv/bin/activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Rename _.env.example_ to _.env_ and add your own values:

```bash
ALCHEMY_API_KEY=<key>
TEST_NET=<bool>
SEPOLIA_MARKETPLACE_ADDRESS=<address>
```

5. Run the script

```bash
py inequality.py
```
