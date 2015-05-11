#!/bin/bash

mkdir -p tmp/
qemu-img create tmp/t.img 4G
sudo qemu-nbd -c /dev/nbd0 tmp/t.img

