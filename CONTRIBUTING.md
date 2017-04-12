##Contributing

Contributions are encouraged, while it must be noted, this project has a planned path and you should seek to contact the authors, before undergoing any large development.  All contributions will be placed under the same apache license, contributers must agree to that license.

The following is expected from any pull requests.

1. [Fork](http://help.github.com/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # clone your fork
   git clone https://github.com/<your-username>/site.git
   # change directory to the repository folder
   cd site
   # set the official hosting-reseller repo to a remote branch called "upstream"
   git remote add upstream https://github.com/hutchgrant/hosting-reseller.git
   ```

2. If you cloned a while ago, make sure to update with the latest changes from upstream branch:

   ```bash
   git checkout master
   git pull upstream master
   ```

3. Create a new branch for your changes/fixes

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream master
   ```

6. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
    with a clear title and description against the `master` branch.
