import { useState } from 'react'
import { Sparkles, Wand2 } from 'lucide-react'
import { useReferenceData } from '../api/ReferenceDataContext.jsx'
import { useI18n } from '../i18n/I18nContext.jsx'
import { Card, Empty } from '../components/ui.jsx'

const MODES = ['DEATHMATCH', 'DOMINATION', 'STRONGHOLDS', 'BLITZ']
const SIZES = ['1v1', '2v2', '3v3']

/** Guías personalizadas: el formulario ya existe; el motor de recomendaciones llegará después. */
export default function GuidesPage() {
  const { t } = useI18n()
  const { leaders, maps } = useReferenceData()
  const [form, setForm] = useState({ leader: '', mode: MODES[0], size: '1v1', map: '' })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="grid grid--main">
      <Card eyebrow={t('guides.eyebrow')} title={t('guides.title')} icon={Wand2}>
        <p className="muted" style={{ margin: 0 }}>{t('guides.body')}</p>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="field">
            <label htmlFor="g-leader">{t('guides.leader')}</label>
            <select id="g-leader" value={form.leader} onChange={set('leader')}>
              <option value="">{t('guides.choose')}</option>
              {leaders.map((l) => <option key={l.key} value={l.key}>{l.alias}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="g-mode">{t('guides.mode')}</label>
            <select id="g-mode" value={form.mode} onChange={set('mode')}>
              {MODES.map((m) => <option key={m} value={m}>{t(`mode.${m}`)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="g-size">{t('common.teamSize')}</label>
            <select id="g-size" value={form.size} onChange={set('size')}>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="g-map">{t('guides.map')}</label>
            <select id="g-map" value={form.map} onChange={set('map')}>
              <option value="">{t('guides.anyMap')}</option>
              {maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
        <button type="button" className="btn btn--primary" disabled style={{ alignSelf: 'flex-start' }}>
          <Sparkles size={16} strokeWidth={1.5} aria-hidden="true" />{t('guides.generate')}
        </button>
      </Card>
      <Card eyebrow={t('guides.previewEyebrow')} title={t('guides.preview')}>
        <Empty center title={t('common.comingSoon')}>{t('guides.previewHint')}</Empty>
      </Card>
    </div>
  )
}
