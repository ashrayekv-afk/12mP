"""First-visit NKPI sensitivity. No progression probability is inferred.

Published pair-repeatability limits set *hypothetical perturbation sizes* only.
The envelope is a deterministic box stress test, never a confidence interval.
"""
from __future__ import annotations
import copy
from .assessment import FEATURES, infer, model
from .evidence import KEYS, pair_limits

VERSION = '1.0.0-baseline-sensitivity'
FORECAST_STATUS = 'withheld_no_released_horizon_model'


def configuration():
    m = model('baseline')
    return dict(version=VERSION, research_only=True, calibrated=False,
                forecast_status=FORECAST_STATUS, horizon_months=12,
                method='reference_pair_limit_box',
                reference_pair_limits=dict(zip(KEYS, map(float, pair_limits({'Kmax':40})))),
                kmax_bands=[dict(minimum=48.2,limit=1.33),dict(minimum=53.9,limit=1.62)],
                features=m['features'], feature_spec=m['feature_spec'],
                center=m['center'], scale=m['scale'], coefficients=m['coefficients'],
                intercept=m['intercept'])


def analyze(assessment, input_sha256):
    case = assessment['case']
    result = dict(version=VERSION, eye=case['eye'], input_sha256=input_sha256,
                  model_sha256=assessment['model_sha256'], research_only=True,
                  calibrated=False, status='unavailable', reason='Awaiting an eligible single-visit calculation.',
                  forecast=dict(status=FORECAST_STATUS, horizon_months=12, probability=None))
    if case['mode'] != 'baseline':
        result['reason'] = 'This eye uses two visits. Its observed evidence is in the next section.'
        return result
    if not assessment['prediction'] or assessment['status'] != 'ready':
        result['reason'] = 'Resolve this eye’s held inputs above before assessing baseline sensitivity.'
        return result
    original = assessment['prediction']['nkpi']
    limits = dict(zip(KEYS, map(float, pair_limits(case['first']))))
    m = model('baseline')
    down, up = copy.deepcopy(case), copy.deepcopy(case)
    rows = []
    for f in FEATURES:
        key = f['key']; value = case['first'][key]; delta = limits[key]
        lo, hi = max(f['low'],value-delta), min(f['high'],value+delta)
        minus, plus = copy.deepcopy(case), copy.deepcopy(case)
        minus['first'][key], plus['first'][key] = lo, hi
        score_lo, score_hi = infer(minus)['nkpi'], infer(plus)['nkpi']
        index = m['features'].index('baseline_'+key)
        positive = m['coefficients'][index] * m['feature_spec']['baseline_'+key].get('direction',1) >= 0
        down['first'][key], up['first'][key] = (lo,hi) if positive else (hi,lo)
        rows.append(dict(key=key,value=value,reference_pair_limit=delta,input_low=lo,input_high=hi,
                         clipped=(lo != value-delta or hi != value+delta),
                         score_at_low=score_lo,score_at_high=score_hi,
                         score_low=min(score_lo,score_hi),score_high=max(score_lo,score_hi),
                         maximum_shift=max(abs(score_lo-original),abs(score_hi-original))))
    rows.sort(key=lambda x:x['maximum_shift'],reverse=True)
    low, high = infer(down)['nkpi'], infer(up)['nkpi']
    result.update(status='ready',reason=None,current_nkpi=original,score_low=low,score_high=high,
                  rows=rows, largest_sensitivity=rows[0]['key'], age_fixed=case['age'],
                  within_training_ranges=not assessment['prediction']['outside_range'],
                  outside_training_ranges=assessment['prediction']['outside_range'],
                  top_contributors=copy.deepcopy(assessment['prediction']['effects'][:3]),
                  scan_quality=case['scan_quality']['first'], treatment=case['treatment'],
                  clipped=any(r['clipped'] for r in rows))
    return result
