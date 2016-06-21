OpenInfoMan channel config for the OpenHIM
==========================================

This tool queries the OpenInfoMan for all its registered documents and for each document a channel is created in the OpenHIM that routes requests to the OpenInfoMan. These channels can be used to restrict access to particular documents.

By default, a role matching the name of a particular document will created for that document's channel. However this utility allows you to interactively define the roles that will be created before submitting the new channels to the OpenHIM. You can also use the utility to create roles for specific CSD functions.

Install with `npm install -g openhim-openinfoman-config-script`

You will now have a new binary installed on your system `cnf-openhim-openinfoman`

Run `cnf-openhim-openinfoman -h` and you should see the following output on how to use the script

```sh
cnf-openhim-openinfoman

  This script creates custom channels in the OpenHIM for each registered document
  in an OpenInfoMan instance

Synopsis

  $ cnf-openhim-openinfoman -i http://localhost:8984 -m https://localhost:8080 -u root@openhim.org -p password

Options

  -h, --help           Display this usage guide.
  -i, --openinfoman    The openinfoman base url (default: http://localhost:8984)
  -m, --openhim        The OpenHIMs base API url (default: https://localhost:8080)
  -u, --username       The OpenHIMs API username (default: root@openhim.org)
  -p, --password       The OpenHIMs API password

```

Run the script with the options necessary for your particular instance.

Run this repository's tests with `npm test`.
