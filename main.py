import fire
import json

GekiDans = ['シリウス', 'Eden', '銀河座', '劇団電姫']

def get_all_templates(
    src_fp = "character/SenseMaster.json",
    tgt_fp = "templates.txt"
):
    with open(src_fp, encoding='UTF-8') as f:
        items = json.loads(f.read())
    templates = set()  # type: set
    for item in items:
        desc = item['description']  # type: str
        sense_effects = desc.split('／')
        for effect in sense_effects:
            for gekidan in GekiDans:
                effect = effect.replace(gekidan, '[gekidan]')
            templates.add(effect)
    templates = list(templates)
    templates = sorted(templates)
    with open(tgt_fp, 'w', encoding='UTF-8') as f:
        f.write('\n'.join(templates))

def main(task, **kwargs):
    globals()[task](**kwargs)

if __name__ == '__main__':
    fire.Fire(main)







