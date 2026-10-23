"""本机文件名辨识规则的设置与只读预览。"""
from . import filename_rules


def q_filename_rules(contract, _args):
    return {'items': filename_rules.load(contract.follow_state_root)}


def w_filename_rules(contract, body):
    if body.get('action') == 'preview':
        return filename_rules.Engine(body.get('items')).recognize(body.get('filename'))
    if body.get('action') not in (None, 'save'):
        raise ValueError('文件名规则动作无效')
    return {'items': filename_rules.save(contract.follow_state_root, body.get('items'))}
