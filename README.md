## First steps to run in Android Emulator or Device

### Install NodeJS

### Install Ionic

```
npm install -g cordova ionic gulp bower
```

### Install Android SDK
#####Add Android SDK to the PATH
#####Create an Android Emulator avd

### Add Android platform

```
ionic platform add android
```

### Build an Android app

```
$ ionic build android
```

### Deploying on Android devices

```
ionic emulate android
```


## Running this project in development

```
$ sudo npm install -g cordova ionic gulp bower
$ npm install
$ bower install
$ gulp
$ ionic serve
```

## Errors that you could find

####Error: ANDROID_HOME is not set and android command not in your path You must fulfill at least one of these conditions

[link](http://stackoverflow.com/questions/26356359/error-android-home-is-not-set-and-android-command-not-in-your-path-you-must-ful)

#### Error in launching AVD

![image](http://i.stack.imgur.com/8BKmm.png)

[link](http://stackoverflow.com/questions/26355645/error-in-launching-avd)

#### How do I fix “Failed to sync vcpu reg” error?

[link](http://stackoverflow.com/questions/17024538/how-do-i-fix-failed-to-sync-vcpu-reg-error)