# Website Screenshot Capture
> Automatically captures screenshots of specified web pages, with options to load from a YAML file or via direct inputs.

## Contents
- [Usage](#usage)
- [Inputs](#inputs)
- [Output](#output)
- [Example](#example)
    - [Push images to another Repository](#push-images-to-another-repository)
- [Use on](#use-on)

## Usage

### Load file with `YAML`
```yaml
- name: Website screenshot
  uses: lauta-dev/website-screenshot-capture-action
  with:
    urls_input_file: anything.yml # or pages.yaml
```

#### File example
```yaml
pages:
  - url: https://google.com
    name: google
  - url: https://github.com/Lauta-dev/website-screenshot-capture-action/
    name: Repository
    # It's optional
    # It will be used to run a script before the screenshot
    # For example, remove headers
    script: remove_headers.js
```

### Direct inputs
```yaml
- name: Website screenshot
  uses: lauta-dev/website-screenshot-capture-action
  with:
    url: https://github.com/lauta-dev/website-screenshot-capture-action
    name: Repository
```

## Inputs

### Required inputs
| Input      | Type      |
|------------|-----------|
| name       | string    |
| url        | string    |
| urls_input_file | YAML file |

> [!NOTE]
> By default, the program will try to load the YAML file. If not found, it will load url and name. 

### Optional inputs

| Input      | Type      | Default        | Posible value   |
|------------|-----------|----------------|-----------------|
| width      | number    | 1366           |                 |
| height     | number    | 768            |                 |
| type       | string    | png            | png, webp, jpeg |
| quality    | number    | 100            | 0 to 100        |
| output_dir     | string    | screenshots    |         |
| script         | string    |                |         |

> [!NOTE]
> Quality is only applicable to webp and jpeg.

## Output
Screenshots are saved in screenshots/.


## Example
```yaml
name: Take screenshot
on:
  - push

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - name: Screenshot Capture
        uses: lauta-dev/website-screenshot-capture-action
        with:
          urls_input_file: pages.yml
          width: 412
          height: 915
          type: webp
          quality: 60
```

### Push images to another repository
```yaml
name: Take screenshot
on:
  - push

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - name: Screenshot Capture
        uses: lauta-dev/website-screenshot-capture-action
        with:
          urls_input_file: pages.yml
          width: 412
          height: 915
          type: webp
          quality: 60
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: screenshots/

  push-images:
    runs-on: ubuntu-latest
    needs: [screenshots]
    steps:
      - name: Clone repository
        run: git clone https://github.com/"user"/"repo".git

      - name: Download artifact
        uses: actions/download-artifact@v3
        with:
          name: screenshots

      - name: Set up Git
        run: |
          git config user.name "${{ secrets.GH_USERNAME }}"
          git config user.email "${{ secrets.GH_MAIL }}"
          git remote set-url origin https://x-access-token:${{ secrets.ACCESS_TOKEN }}@github.com/"user"/"repo".git

      - name: Add images and commited
        run: |
          git add .
          git commit -m "Agregar captura de pantalla"

      - name: Push screenshots
        run: |
          git push origin main
```

## Use on:
- [Lauta-dev/portafolio](https://github.com/lauta-dev/portafolio)
