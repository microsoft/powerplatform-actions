# GitHub Actions for Power Platform Hands-on Lab

## Module 0 - Pre-Lab Setup

# Lab scenario

This hand-on lab will give you an opportunity to get hands on with the best practices to get your app into source control, generate a managed solution from Source (your build artifact) and finally deploy the app into another environment.  You will need access to 3 CDS environments (Development, Build & Production) along with a GitHub account to automate deployments.

You will need to create three environments in your demo or customer tenant.  To do this follow these instructions:

1. Login to a tenant that you have access to and that minimum 3GB available capacity which is required to create 3 environments.

2. Go to <https://admin.powerplatform.microsoft.com/>, this will take you to the Power Platform admin center

3. Select **Environments** in the navigation area

4. Select **+ New** to create your first new environment

    ![Select environment](media/gh-lab-0.30-0.40.png "Select environment and click New")

5. The first environment should be named “Your Name – dev”, set the region to “United States (default)”, set the Environment type to **Sandbox** (if available), if not use “Trial”.

    - Ensure the ***Create a database for this environment*** radio toggle is set to **Yes**

    ![Create environment](media/gh-lab-0.50.png "Create environment")

6. **Click Next.**

7. Set the Language and currency as preferred and set the "***Deploy sample apps and data?*** " radio button to **Yes**, then **click Save**

    ![Set currency](media/gh-lab-0.70.png "Set currency")

8. Your development environment has been created, follow steps 3 – 7 above to create a second environment called “Your Name – build” , and then finally, create a third environment called “Your Name – prod”

9. Now you have the environments that we will need for this and ready to begin the next modules of this Hands-on lab
