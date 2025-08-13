# React

> Integrate Civic Auth into your React application with ease, just wrap your app with the Civic Auth provider and add your Client ID (provided after you [sign up](https://auth.civic.com)).

## Quick Start

A working example is available in our [github examples repo](https://github.com/civicteam/civic-auth-examples/tree/main/packages/civic-auth/reactjs).

<Info>
  This guide assumes you are using Typescript. Please adjust the snippets as needed to remove the types if you are using plain JS.
</Info>

<Info>
  If you plan to use Web3 features, select "Auth + Web3" from the tabs below.
</Info>

<Tabs>
  <Tab title="Auth">
    ```ts App.ts
    import { CivicAuthProvider, UserButton } from "@civic/auth/react";

    function App({ children }) {
      return (
        <CivicAuthProvider clientId="YOUR CLIENT ID">
          <UserButton />
          {children}
        </CivicAuthProvider>
      )
    }
    ```
  </Tab>

  <Tab title="Auth + Web3">
    ```ts App.ts
    import { CivicAuthProvider, UserButton } from "@civic/auth-web3/react";

    function App({ children }) {
      return (
        <CivicAuthProvider clientId="YOUR CLIENT ID">
          <UserButton />
          {children}
        </CivicAuthProvider>
      )
    }
    ```
  </Tab>
</Tabs>

## Usage

### The User Button

The Civic Auth SDK comes with a multi-purpose styled component called the `UserButton`

<Tabs>
  <Tab title="Auth">
    ```ts TitleBar.ts
    import { UserButton, CivicAuthProvider } from "@civic/auth/react";

    export function TitleBar() {
      return (
        <div>
          <h1>My App</h1>
          <UserButton />
        </div>
      );
    };
    ```
  </Tab>

  <Tab title="Auth + Web3">
    ```ts TitleBar.ts
    import { UserButton, CivicAuthProvider } from "@civic/auth-web3/react";

    export function TitleBar() {
      return (
        <div>
          <h1>My App</h1>
          <UserButton />
        </div>
      );
    };
    ```
  </Tab>
</Tabs>

This component is context-dependent. If the user is logged in, it will show their profile picture and name. If the user is not logged in, it will show a Log In button. The button will show a loading spinner while the user is in the process of signing in or signing out.

<Frame caption="The user button">
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/civic/images/auth/integration/image-1.png" className="image-50 image-rounded" />
</Frame>

#### Customizing the User Button

You can customize the styling of the user button by adding either a `className` or `style` property to the UserButton component when declaring it. These styling properties affect both the sign-in button and the user information display when logged in. For further customization, you can also style the buttons that appear in the dropdown menu (which displays when clicking on the user information button) by using the `dropdownButtonClassName` or `dropdownButtonStyle` properties. This gives you granular control over both the main user button and its associated dropdown menu items. Using a className:

<Tabs>
  <Tab title="Auth">
    ```css style.css
    .my-button-container .login-button {
      color: red;
      background-color: blue;
      border: 3px solid #6b7280;
    }

    .my-button-container .internal-button {
      background-color: red;
      color: blue;
      border: 3px solid #6b7280;
    }
    ```

    ```ts CustomUserButtonClassName.ts
    import { UserButton, CivicAuthProvider } from "@civic/auth/react";

    export function TitleBar() {
      return (
        <div className="my-button-container">
          <UserButton className="login-button" dropdownButtonClassName="internal-button" />
        </div>
      );
    };
    ```
  </Tab>

  <Tab title="Auth + Web3">
    ```css style.css
    .my-button-container .login-button {
      color: red;
      background-color: blue;
      border: 3px solid #6b7280;
    }

    .my-button-container .internal-button {
      background-color: red;
      color: blue;
      border: 3px solid #6b7280;
    }
    ```

    ```bash CustomUserButtonClassName.ts
      import { UserButton, CivicAuthProvider } from "@civic/auth-web3/react";

      export function TitleBar() {
        return (
          <div className="my-button-container">
            <UserButton className="login-button" dropdownButtonClassName="internal-button" />
          </div>
        );
      };
    ```
  </Tab>
</Tabs>

Note the use of a *specific* class name declaration in the .css file. This is necessary to ensure that the styles in the imported css className take precedence over internal styles without the use of the discouraged `!important` directive i.e. using just the classname in App.css *would not work*:

```css
/* this wouldn't override the Civic UserButton styles */
.login-button {
  color: red;
  background-color: blue;
  border: 3px solid #6b7280;
}
```

Using styles:

<Tabs>
  <Tab title="Auth">
    ```ts CustomUserButtonStyles.ts
    import { UserButton, CivicAuthProvider } from "@civic/auth/react";

    export function TitleBar() {
      return (
        <div>
          <UserButton style={{ minWidth: "20rem" }} dropdownButtonStyle={{ backgroundColor: "red" }} />
        </div>
      );
    };
    ```
  </Tab>

  <Tab title="Auth + Web3">
    ```ts CustomUserButtonStyles.ts
    import { UserButton, CivicAuthProvider } from "@civic/auth-web3/react";

    export function TitleBar() {
      return (
        <div>
          <UserButton style={{ minWidth: "20rem" }} dropdownButtonStyle={{ backgroundColor: "red" }} />
        </div>
      );
    };
    ```
  </Tab>
</Tabs>

You can also provide values in both `style` and `className` props, where the value in `style` will always take precedence over the same CSS-defined style.

### Getting User Information on the Frontend

Use the Civic Auth SDK to retrieve user information on the frontend.

<Tabs>
  <Tab title="Auth">
    ```ts MyComponent.ts
    import { useUser } from "@civic/auth/react";

    export function MyComponent() {
      const { user } = useUser();

      if (!user) return <div>User not logged in</div>

      return <div>Hello { user.name }!</div>
    }
    ```
  </Tab>

  <Tab title="Auth + Web3">
    ```ts MyComponent.ts
    import { useUser } from "@civic/auth-web3/react";

    export function MyComponent() {
      const { user } = useUser();

      if (!user) return <div>User not logged in</div>

      return <div>Hello { user.name }!</div>
    }
    ```
  </Tab>
</Tabs>

<Info>
  We use `name` as an example here, but you can call any user object property from the user fields schema, as shown [below](/integration/react#base-user-fields).
</Info>

#### Creating your own Login and Logout buttons

You can use the `signIn()` and `signOut()` methods from the `useUser()` hook to create your own buttons for user log in and log out

<Tabs>
  <Tab title="Auth">
    ```ts RollYourOwnLogin.ts
    import { useUser } from "@civic/auth/react";

    export function TitleBar() {
      const { user, signIn, signOut } = useUser();
      return (
        <div className="flex justify-between items-center">
          <h1>My App</h1>
          {!user && <button onClick={signIn} className="sign-in">Sign into My App</button>}
          {user && <button onClick={signOut} className="sign-out">Sign out of My App</button>}
        </div>
      );
    };
    ```
  </Tab>

  <Tab title="Auth + Web3">
    ```ts RollYourOwnLogin.ts
    import { useUser } from "@civic/auth-web3/react";

    export function TitleBar() {
      const { user, signIn, signOut } = useUser();
      return (
        <div className="flex justify-between items-center">
          <h1>My App</h1>
          {!user && <button onClick={signIn} className="sign-in">Sign into My App</button>}
          {user && <button onClick={signOut} className="sign-out">Sign out of My App</button>}
        </div>
      );
    };
    ```
  </Tab>
</Tabs>

## Advanced Configuration

Civic Auth is a "low-code" solution, so all configuration takes place via the [dashboard](https://auth.civic.com). Changes you make there will be updated automatically in your integration without any code changes. The only required parameter you need to provide is the client ID.

The integration provides additional run-time settings and hooks that you can use to customize the library's integration with your own app. If you need any of these, you can add them to the CivicAuthProvider as follows:

```ts
<CivicAuthProvider
  clientId="YOUR CLIENT ID"
  ...other configuration
>
```

See below for the list of all configuration options

| Field       | Required | Default    | Example                                                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------- | -------- | ---------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| clientId    | Yes      | -          | `2cc5633d-2c92-48da-86aa-449634f274b9`                                                         | The key obtained on signup to [auth.civic.com](https://auth.civic.com)                                                                                                                                                                                                                                                                                                                           |
| nonce       | No       | -          | 1234                                                                                           | A single-use ID used during login, binding a login token with a given client. Needed in advanced authentication processes only                                                                                                                                                                                                                                                                   |
| onSignIn    | No       | -          | `(error?: Error) => {  if (error) {     // handle error  } else {// handle successful login}}` | A hook that executes after a sign-in attempt, whether successful or not.                                                                                                                                                                                                                                                                                                                         |
| onSignOut   | No       | -          | `() => { // handle signout }`                                                                  | A hook that executes after a user logs out.                                                                                                                                                                                                                                                                                                                                                      |
| redirectUrl | No       | currentURL | /authenticating                                                                                | An override for the page that OAuth will redirect to to perform token-exchange. By default Civic will redirect to the current URL and Authentication will be finished by the Civic provider automatically. Only use if you'd like to have some custom display or logic during OAuth token-exchange. The redirect page must have the CivicAuthProvider running in order to finish authentication. |
| iframeMode  | No       | modal      | iframeMode=\{"embedded"}                                                                       | Set to `embedded` if you want to embed the login iframe in your app rather than opening the iframe in a modal. See [Embedded Login Iframe section](/integration/react#embedded-login-iframe) below.                                                                                                                                                                                              |
| displayMode | No       | iFrame     | "iframe" \| "redirect" \| "new\_tab"                                                           | **"iframe"**: Authentication happens in an embedded window within your current page.<br />**"redirect"**: Full page navigation to the auth server and back to your site after completion.<br />**"new\_tab"**: Opens auth flow in a new browser tab, returning to original tab after completion.                                                                                                 |

### Display Mode

The display mode indicates where the Civic login UI will be displayed. The following display modes are supported:

* `iframe` (default): the UI loads in an iframe that shows in an overlay on top of the existing page content

* `redirect`: the UI redirects the current URL to a Civic login screen, then redirects back to your site when login is complete

* `new_tab`: the UI opens in a new tab or popup window (depending on browser preferences), and after login is complete, the tab or popup closes to return the user to your site

## API

### User Context

The full user context object (provided by `useUser`) looks like this:

```js
{
  user: User | null;
  // these are the OAuth tokens created during authentication
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  forwardedTokens?: ForwardedTokens;
  // functions and flags for UI and signIn/signOut
  isLoading: boolean;
  authStatus: AuthStatus;
  error: Error | null;
  signIn: (displayMode?: DisplayMode) => Promise<void>;
  signOut: () => Promise<void>;
}
```

#### AuthStatus

The `authStatus` field exposed in the UserContext can be used to update your UI depending on the user's authentication status, i.e. update the UI to show a loader while the user is in the process of authenticating or signing out.

```json
export enum AuthStatus {
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
  AUTHENTICATING = "authenticating",
  ERROR = "error",
  SIGNING_OUT = "signing_out",
}
```

### User

The `User` object looks like this:

```json
type BaseUser = {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  updated_at?: Date;
};

type User = BaseUser & T;
```

Where you can pass extra user attributes to the object that you know will be present in user claims, e.g.

```json
const UserWithNickName = User<{ nickname: string }>;
```

Field descriptions:

#### Base User Fields

| Field        |                                                                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| id           | The user's unique ID with respect to your app. You can use this to look up the user in the [dashboard](https://auth.civic.com/dashboard). |
| email        | The user's email address                                                                                                                  |
| name         | The user's full name                                                                                                                      |
| given\_name  | The user's given name                                                                                                                     |
| family\_name | The user's family name                                                                                                                    |
| updated\_at  | The time at which the user's profile was most recently updated.                                                                           |

#### Token Fields

<Info>
  Typically developers will not need to interact with the token fields, which are used only for advanced use cases.
</Info>

| Field           |                                                                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| idToken         | The OIDC id token, used to request identity information about the user                                                                                                                                  |
| accessToken     | The OAuth 2.0 access token, allowing a client to make API calls to Civic Auth on behalf of the user.                                                                                                    |
| refreshToken    | The OAuth 2.0 refresh token, allowing a login session to be extended automatically without requiring user interaction. The Civic Auth SDK handles refresh automatically, so you do not need to do this. |
| forwardedTokens | If the user authenticated using SSO (single-sign-on login) with a federated OAuth provider such as Google, this contains the OIDC and OAuth 2.0 tokens from that provider.                              |

#### Forwarded Tokens

Use forwardedTokens if you need to make requests to the source provider, such as find out provider-specific information.

An example would be, if a user logged in via Google, using the Google forwarded token to query the Google Groups that the user is a member of.

For example:

```ts
const googleAccessToken = user.forwardedTokens?.google?.accessToken;
```

#### Embedded Login Iframe

If you want to have the Login screen open directly on a page without the user having to click on button, you can import the `CivicAuthIframeContainer` component along with the AuthProvider option iframeMode`={"embedded"}`

You just need to ensure that the `CivicAuthIframeContainer` is a child under a `CivicAuthProvider`

<Tabs>
  <Tab title="Auth">
    ```ts App.ts
    import { CivicAuthIframeContainer } from "@civic/auth/react";

    const Login = () => {
      return (
          <div className="login-container">
            <CivicAuthIframeContainer />
          </div>
      );
    };

    const App = () => {
      return (
          <CivicAuthProvider
            clientId={"YOUR CLIENT ID"}
            iframeMode={"embedded"}
          >
            <Login />
          </CivicAuthProvider>
      );
    }
    ```
  </Tab>

  <Tab title="Auth + Web3">
    ```ts App.ts
    import { CivicAuthIframeContainer } from "@civic/auth-web3/react";

    const Login = () => {
      return (
          <div className="login-container">
            <CivicAuthIframeContainer />
          </div>
      );
    };

    const App = () => {
      return (
          <CivicAuthProvider
            clientId={"YOUR CLIENT ID"}
            iframeMode={"embedded"}
          >
            <Login />
          </CivicAuthProvider>
      );
    }
    ```
  </Tab>
</Tabs>
