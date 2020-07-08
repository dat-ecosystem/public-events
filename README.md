# Dat Events

Events hosted by the [Dat foundation](https://dat.foundation), published on [events.dat.foundation](https://events.dat.foundation).

* [2020](website/content/2020.md)
* [2019](website/content/2019.md)


### Development

Built with [Eleventy](https://www.11ty.dev/) and deployed through Netlify.

To develop locally:
```bash
cd website
npm run i
npm run dev
```

To build the static export:
```
npm run build
```

The static export then is in `website/dist`.

### Notes

The build process will download files in a cache (see build log), this may grow large and it might be a good
idea to clean it every now and then.
