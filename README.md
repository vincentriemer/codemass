# codeweight [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/vincentriemer/codeweight)

Github repository badges for the filesize of your client-side library.

## Usage

For this example I'm going to use the popular javascript animation framework [Velocity.js](http://VelocityJS.org).

First when in the [Github Repo](https://github.com/julianshapiro/velocity) of your target library you're going to want to navigate to the file you wish to display the size of.

Next, you're going to want to grab the url of the file you've navigated to (be sure **not** to use the raw.githubusercontent url). As an example [here's](https://github.com/julianshapiro/velocity/blob/master/velocity.min.js) the link to Velocity's minified build.

Take the url...

```
https://github.com/julianshapiro/velocity/blob/master/velocity.min.js
```

...and replace the `https://github.com` with `http://codeweight.io`. Your URL should now look like...

```
http://codeweight.io/julianshapiro/velocity/blob/master/velocity.min.js
```

Finally, when you use the above link as the source of an image this should be the result:

![VelocityJS Size](http://codeweight.io/julianshapiro/velocity/blob/master/velocity.min.js)

Just put that image in your README and it should automatically update whenever the size of the file changes!

## Special Thanks

Thank you [Github](https://github.com) and [Shields.io](http://shields.io) as this service wouldn't exist without your awesome APIs!

## License

The MIT License (MIT)

Copyright (c) 2015 Vincent Riemer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.