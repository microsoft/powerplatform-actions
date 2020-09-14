# Power Platform Actions

**PRE-RELEASE SOFTWARE.** The software is a pre-release version. It may not work the way a final version of the software will. We may change it for the final, commercial version. We also may not release a commercial version.

This repo provides multiple [GitHub Action](https://help.github.com/en/actions) for Power Platform.
Each GH Power Platform Action wraps the existing [Power Apps CLI](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/powerapps-cli)

To run tasks from this offering, add the following to your existing Actions workflow; also add the secret `mypassword` to your repo's 'Settings' | 'Secrets'

```yaml
    steps:
    - name: Export Solution
      uses: microsoft/powerplatform/export-solution@v0
      with:
        environment-url: 'https://myenv.crm.dynamics.com'
        user-name: 'me@myenv.onmicrosoft.com'
        password-secret: ${{ secrets.mypassword }}
        solution-name: aSolution
        solution-output-file: 'aSolution.zip'
        working-directory: 'out'

    - name: Unpack Solution
      uses: microsoft/powerplatform/unpack-solution@v0
      with:
        solution-input-file: 'out/aSolution1.zip'
        solution-target-folder: 'src/solutions/solution one'
        solution-type: 'Unmanaged'
        overwrite-files: true
```

[![CI](https://github.com/microsoft/powerplatform-actions/workflows/CI/badge.svg)](https://github.com/microsoft/powerplatform-actions/actions?query=workflow%3ACI)

## Setting Up Dev Environment

Windows, macOS or Linux:

- [Node.js LTS (currently v12)](https://nodejs.org/en/download/)
- gulp CLI: ```npm install -g gulp-cli```
- [git](https://git-scm.com/downloads)
- [VS Code](https://code.visualstudio.com/Download) or your different favorite editor
- recommended VSCode extensions:
  - [EditorConfig for VS Code (editorconfig.editorconfig)](https://github.com/editorconfig/editorconfig-vscode)
  - [ESLint (dbaeumer.vscode-eslint)](https://github.com/Microsoft/vscode-eslint)
  - [GitLens (eamodio.gitlens)](https://github.com/eamodio/vscode-gitlens)
  - [markdownlint (davidanson.vscode-markdownlint)](https://github.com/DavidAnson/vscode-markdownlint)
  - [Mocha sidebar (maty.vscode-mocha-sidebar)](https://github.com/maty21/mocha-sidebar)
- TEMPORARY: create a PAT for the Azure DevOps org ```msazure``` with scope: package(read) and add it as local environment variable:
```Powershell
[Environment]::SetEnvironmentVariable('AZ_DevOps_Read_PAT', '<yourPAT>', [EnvironmentVariableTarget]::User)
```

## Getting Started

Clone, restore modules, build and run:

```bash
git clone https://github.com/microsoft/powerplatform-actions.git
cd powerplatform-actions
npm install
gulp
```

## Refreshing actions in dist folder

Run ```npm run dist``` and commit and push the updates in the ```./dist``` folder.

## Details

[CLI command for pac](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/powerapps-cli#solution)

## References

### ADAL

### CustomerEngagement API

- [WebAPI](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/overview)
- [WebAPI REST API](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/about?view=dynamics-ce-odata-9)
- [OrgService](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/org-service/overview)
- [Org url discovery](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/discover-url-organization-web-api)

### PowerApp Environemnt (BAP)

- [Environments Overview](https://docs.microsoft.com/en-us/power-platform/admin/environments-overview)
