# GitHub Actions for Power Platform Hands-on Lab

## Module 0 - Pre-Lab Setup 

# Lab scenario: 
This hand-on lab will give you an opportunity to get hands on with the best practices to get your app into source control, generate a managed solution from Source (your build artifact) and finally deploy the app into another environment.  You will need access to 3 CDS environments (Development, Build & Production) along with a GitHub account to automate deployments.


You will need to create three environments in your demo or customer tenant.  To do this follow these instructions:
1.	Login to a tenant that you have access to and that minimum 3GB available capacity which is required to create 3 environments.
2.	Go to https://admin.powerapps.com , this will take you to the admin center
3.	Select Environments in the navigation area

![Select environment](media/gh-lab-0.30.png "Select environment")

4.	Select “+ New Environment” to create your first new environment

![New environment](media/gh-lab-0.40.png "New environment")

5.	The first environment should be named “Your Name – dev”, set the region to “United States (default)”, set the Environment type to “Production” (if available) if not use “Trial”

![Create environment](media/gh-lab-0.50.png "Create environment")

6.	Select “Create environment”

7.	Now that your environment has been created select “Create database”

![Select environment](media/gh-lab-0.70.png "Select environment")

8.	Set the Currency to “USD” and Language to “English”, Include the sample apps and data then select “Create database”

![Set currency](media/gh-lab-0.80.png "Set currency")

9.	Your development environment has been created, follow steps 4 – 8 above to create a second environment called “Your Name – build” , and then finally, create a third environment called “Your Name – prod” – NOTE the third environment can be a trial environment type.

10.	Now you have the environments that we will need for this and ready to begin the next modules of this Hands-on lab
