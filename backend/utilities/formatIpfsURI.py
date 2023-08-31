

def format_IPFS_URI(uri):
    if 'ipfs://' in uri:
        uri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    return uri
