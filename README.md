# BlankOn Linux Installer

[![Build Status](https://api.travis-ci.org/BlankOn/blankon-installer.svg?branch=master)](https://travis-ci.org/BlankOn/blankon-installer)

## Note

- Use ``DEBUG=1`` to get inspector enabled.

## Packaging

Provide custom `/etc/default/blankon-installer` to modify the behaviour of Blankon Installer.
Customization is provided by setting variables as follows:

* `BI_CUSTOM_GROUPS`. Set this variable to a new group so the created user will join this group. These groups will be created by Blankon Installer during installation.
