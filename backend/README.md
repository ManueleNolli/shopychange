# Backend

The backend is a Django server that exposes graphql APIs to return data from blockchain and database.
The backend is connected with Mongo database.

Please refer to [doc](../doc) for more information about the APIs.

## Getting Started

1. Set up a virtual environment (optional but recommended) More info [here](https://docs.python.org/3/tutorial/venv.html) and [here](https://virtualenv.pypa.io/en/latest/)

```bash
cd backend
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

4. Modify the `.env` file with the following information:

```bash
ALCHEMY_API_KEY=yourAPIKey
```

Alchemy is the provider used to connect with a blockchain node, to get a free API key, follow this guide: [Alchemy Key](https://docs.alchemy.com/docs/alchemy-quickstart-guide#1key-create-an-alchemy-key)

5. If not already done, run the database as explained in [main page](../README.md) and deploy the smart contract as explained in [blockchain](../blockchain/README.md)

6. Run server

```bash
python manage.py runserver
```

## Testing

To run the tests:

```bash
python manage.py test
```
