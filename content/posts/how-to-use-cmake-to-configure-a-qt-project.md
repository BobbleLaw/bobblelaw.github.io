---
title: How to use CMake to configure a Qt project?
description: Configurate Qt project with CMake
toc: false
authors:
  - host
tags:
  - Qt
  - deprecated
categories:
series:
date: '2020-11-20T22:52:56+08:00'
lastmod: '2020-11-20T22:52:56+08:00'
featuredImage:
draft: false
---

### A Simple Qt code

Here is a hello world code for Qt

```
#include <QtCore/QCoreApplication>
#include <QtCore/QDebug>
int main(int argc, char** argv){
    QCoreApplication app(argc, argv);
    qDebug() <<  "Hello, Qt!";
    app.exec()
}
```

1. If we don't use IDE or qmake, but compiler, this is the command

```
g++ main.cpp -I\\path\to\Qt\5.13.0\include -o main -L\path\to\Qt\5.13.0\lib -lQtCore4
```

2. If we have qmake, all we need is

```
CONFIG +=qt
QT -= gui
SOURCE += main.cpp
```

3. If we use cmake, our old friend CMakeList.txt comes to stage

```
PROJECT(example)
FIND_PACKAGE(Qt4 COMPONENTS QtCore REQUIRED)
INCLUDE(${QT_USE_FILE})
ADD_EXECUTABLE(example main.cpp)
```

### A Complete Qt Project

Ususally a complete qt project would consist of the following files
+ main.cpp
+ mainwindows.ui
+ mainwindows.h
+ mainwindows.cpp

Same as part 1,

1. Manual compile
`.ui` needs to preprocess by uic, and convert to `.h`
```
uic mainwindow.ui -o ui.mainwindow.h
```

`.h` needs proprocess by moc, and convert to `.cpp`
```
moc mainwindow.h -o moc_mainwindow.cpp
```

Then we can use the same method in part 1 to compile, here remember to add GUI
```
g++ main.cpp mainwindow.cpp  moc_mainwindow.cpp -Ie:\Qt\4.7.0\include -o main  -Le:\Qt\4.7.0\lib -lQtCore4 -lQtGui4
```
2. Use qmake

3. Use CMake

    
