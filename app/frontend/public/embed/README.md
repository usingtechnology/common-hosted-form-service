# CHEFS Form Viewer Web Component

Documentation is located at [`CHEFS Tech Docs > Capabilities > Integrations > Embed your Form in another Application`](https://developer.gov.bc.ca/docs/default/component/chefs-techdocs/Capabilities/Integrations/Embedding-Webcomponent)

Releases are cut from these sources into `app/embed/releases/<version>/` and committed. The image build does not generate web component files. See [`app/embed/README.md`](../../../embed/README.md) for the release layout and how to cut a release.

### Source Code Organization

#### **Source Files** (in `app/frontend/public/embed/`)

These files are the source for future releases. The frontend build does not ship them; the HTTP paths below serve the frozen v1 copies in `app/embed/releases/v1/embed/`:

| File                                                                                   | Purpose                               | HTTP Path                                            |
| -------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| [`chefs-form-viewer.js`](./chefs-form-viewer.js)                                       | Main web component (development)      | `/app/embed/chefs-form-viewer.js`                    |
| [`chefs-form-viewer-embed.js`](./chefs-form-viewer-embed.js)                           | Simplified embed script (development) | `/app/embed/chefs-form-viewer-embed.js`              |
| [`chefs-form-viewer-generator.html`](./chefs-form-viewer-generator.html)               | Code generator tool                   | `/app/embed/chefs-form-viewer-generator.html`        |
| [`chefs-form-viewer-embed-demo.html`](./chefs-form-viewer-embed-demo.html)             | Interactive embed demo                | `/app/embed/chefs-form-viewer-embed-demo.html`       |
| [`chefs-form-viewer-override-template.css`](./chefs-form-viewer-override-template.css) | CSS theme template for customization  | `/app/embed/chefs-form-viewer-override-template.css` |
| [`chefs-form-viewer-theme-dark.css`](./chefs-form-viewer-theme-dark.css)               | Dark mode/cyberpunk demo theme        | `/app/embed/chefs-form-viewer-theme-dark.css`        |
| [`chefs-form-viewer-theme-material.css`](./chefs-form-viewer-theme-material.css)       | Material Design demo theme            | `/app/embed/chefs-form-viewer-theme-material.css`    |
| [`chefs-form-viewer-theme-demo.html`](./chefs-form-viewer-theme-demo.html)             | Theme testing demo tool               | `/app/embed/chefs-form-viewer-theme-demo.html`       |
| [`README.md`](./README.md)                                                             | This documentation                    | `/app/embed/README.md`                               |

#### **Release Tools**

| File                                                   | Purpose                                                 |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `app/scripts/embed-release.js`                         | `npm run embed:release -- <x.y.z>` cuts a release       |
| `app/src/webcomponents/common/releaseBuilder.js`       | Assembles a release folder and its `integrity.json`     |
| `app/frontend/src/embed/themeExtractor.js`             | Builds `chefs-theme.css` from the frontend CSS bundle   |
| `app/frontend/tests/unit/embed/themeExtractor.spec.js` | Unit tests for theme extraction functionality           |
| `app/frontend/tests/fixtures/chefs-index.fixture.css`  | Test fixture for theme extraction testing               |

#### **For CHEFS Developers**

- **Source files**: Edit files in `app/frontend/public/embed/`
- **Development**: The Vite dev server serves this folder at `/app/embed/`; use non-minified files (`.js`) for easier debugging
- **Releases**: Cut with `npm run embed:release -- <x.y.z>` from `app/`; released files never change

#### **For Embedding Developers**

- **v1 files keep their URLs under `/app/embed/`** (or `/pr-####/embed/` in PR environments)
- **Versioned releases are served from `/app/embed/<x.y.z>/`** with long-lived caching and CORS for SRI
- **Use `.min.js` files in production** for better performance and smaller downloads
- **Custom themes**: Use `chefs-form-viewer-override-template.css` as a starting point. See demo themes (`chefs-form-viewer-theme-dark.css`, `chefs-form-viewer-theme-material.css`) for examples. Use `chefs-form-viewer-theme-demo.html` to test themes.

### Releases

| Release | Contents                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| `v1`    | Frozen legacy files at `/app/embed/` and `/app/webcomponents/v1/`. Unchanged.                                |
| `1.0.0` | v1 behaviour (API key or gateway token) with the fixes below. Loads only its own files, each checked by SRI. |

#### Embedding a release

Load the embed script from the release folder, with its hash from the release's `integrity.json` (`/app/embed/<version>/integrity.json`):

```html
<script
  src="https://<chefs-host>/app/embed/1.0.0/embed/chefs-form-viewer-embed.min.js?form-id=<formId>&auth-token=<jwt>"
  integrity="sha384-qZGPg1SRR08dy4uKklHJM5YqPnwiKfIeWKal675acxmdo6TZgmy0kJ1I2X23OYAM"
  crossorigin="anonymous"
></script>
```

- The embed script loads `chefs-form-viewer.min.js`, Form.io, the CHEFS styles, Font Awesome and the BC Gov components from the same release folder, each with its SRI hash. The CHEFS stylesheet still imports Roboto and Material Icons from Google Fonts, as v1 does.
- The CHEFS base URL defaults to the server and path the script was loaded from; `base-url` overrides it. Set `base-url` whenever the release files are served from somewhere other than CHEFS, or the component sends its API key or token to that server.
- To use the component without the embed script, load `embed/chefs-form-viewer.min.js` with its hash from `integrity.json`.
- A release never changes; moving to another release means changing the version and the hash.

Changes in 1.0.0 from v1:

- `draft()` saves a draft, and only for a form whose settings let submitters save drafts; otherwise it emits `formio:error` and sends nothing. A Public form never allows drafts. v1 stored every draft as a submitted form.
- The `form-viewer` submit endpoint returns `403` for a draft on a form that does not allow drafts, or on a Public form.
- `submit()` called from code reloads the form read-only afterwards, as a button submit does. In v1 that reload was skipped.
- Boolean embed parameters accept `false`, so `auto-reload-on-submit=false` turns auto-reload off.
- The embed script also works under its `.min.js` name.
- No CDN fallbacks, and no `HEAD` requests to find an asset's type.

### Authentication

#### Obtaining a gateway token (server-side only)

Your backend must fetch the JWT before passing it to the embed. Call this endpoint from your server — never expose the form API key to the browser.

- **Endpoint**: `POST {basePath}/gateway/v1/auth/token/forms/{formId}`
- **Authorization**: `Basic base64(formId:apiKey)` (required)
- **Response**: `201 { "token": "<jwt>" }`

The `formId` in the URL must match the `formId` in the Basic auth credentials.

#### Using the token in the webcomponent

The webcomponent uses the `X-Chefs-Gateway-Token` header for authentication when making requests to CHEFS backend endpoints. This custom header allows host applications to use the `Authorization: Bearer` header for their own authentication needs.

- **Header name**: `X-Chefs-Gateway-Token`
- **Value**: JWT token obtained from the gateway token endpoint above
- **Usage**: Automatically added to all requests to CHEFS backend URLs (URLs matching the component's `baseUrl`)

#### Public forms without an API key

A form that uses the Public login option can be embedded without an API key or gateway token, on websites its owner lists under **Manage Form > Web Component > Allowed origins**. The v1 component calls the keyed `form-viewer` endpoints; support for these endpoints in the component comes with release 1.1.0.

| Endpoint                                                  | Purpose                                                 |
| --------------------------------------------------------- | ------------------------------------------------------- |
| `GET {basePath}/webcomponents/v1/public/{formId}/schema`  | Form schema (same response as the keyed endpoint)       |
| `POST {basePath}/webcomponents/v1/public/{formId}/submit` | Submit; returns `201 { id, confirmationId, createdAt }` |

- **Allowed origins**: the browser's `Origin` header must match one of the form's allowed origins (`https://host[:port]`, or `http://` on `localhost`, `127.0.0.1` or `[::1]` for development). A missing or unlisted origin, or an empty list, returns `403`.
- **Public forms only**: any other form returns `404`.
- **Credentials are ignored**: an `Authorization` or `X-Chefs-Gateway-Token` header is removed before the request is handled, so a host page can pass its own headers. The submission is recorded as `public`, the same as a public form submitted in CHEFS.
- **Submissions are final**: only `submission.data` and `submission.metadata` are read from the request, `draft` is always `false`, and data that references uploaded files is rejected with `400`.
- **Keyed embeds are unchanged**: requests with an API key or gateway token use the `form-viewer` endpoints and are not checked against allowed origins.
