# Website screenshot Capture
> Automatically captures screenshots of specified web pages, with options to load from a YAML file or via direct inputs.

## Contents
- [Usage](#usage)
- [Inputs](#inputs)
- [Output](#output)

## Usage

### Load file with `YAML`
```yaml
- name: Website screenshot
  uses: lauta-dev/website-screenshot-capture-action
  with:
    pages_file: pages.yml # or pages.yaml
```
> [!NOTE]
> The file can be named however you like, but it needs to be in YAML format.
> [The file need this format](./pages.yaml)

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
| pages_file | YAML file |

> [!NOTE]
> By default, the program will try to load the YAML file. If not found, it will load url and name. 

### Optional inputs

| Input      | Type      | Default | Posible value   |
|------------|-----------|---------|-----------------|
| width      | number    | 1366    |                 |
| height     | number    | 768     |                 |
| type       | string    | png     | png, webp, jpeg |
| quality    | number    | 100     | 0 to 100        |

> [!NOTE]
> Quality is only applicable to webp and jpeg.

## Output
Screenshots are saved in screenshots/.
