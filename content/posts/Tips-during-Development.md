---
title: Tips during Development
tags: [note, SL]
---

### How to use previous version of gcc 
This problem arises when we try to compile mex file in Matlab. It shows a __warning__ as

    Warning: You are using gcc version '7.x.x'. The version of gcc is not supported. 
    The version currently supported with MEX is '6.4.x'. For a list of currently 
    supported compilers see

An easy solution is to do as followed (simply install the target version),

    sudo apt-get update && \
    sudo apt-get install build-essential software-properties-common -y && \
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y && \
    sudo apt-get update && \
    sudo apt-get install gcc-6 g++-6 -y && \
    sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-6 && \
    gcc -v

But this will affect the global gcc/g++, so we change the configure file for mex only,

    sudo gedit path/to/mex_C_glnxa64.xml
    sudo gedit path/to/MATLAB/bin/glnxa64/mexopts/g++_glnxa64.xml

and replace `Location="$GCC"` with `Location="/usr/bin/gcc-x.x"`, same for g++, replace `Location="$G++"` with `Location="/usr/bin/gc++-x.x"`
