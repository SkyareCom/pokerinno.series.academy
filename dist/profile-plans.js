import {legacyProfile} from './legacy-profile-data.js?v=profile-plans-9550c742';

// Presentation and launch prices from Academy Verde 8, commit ff0fb41f80d71616601dfdc161199867188f24d1.
export function renderProfilePlans(t,locale){
 const price=cents=>'R$ '+new Intl.NumberFormat(locale,{minimumFractionDigits:cents?2:0,maximumFractionDigits:cents?2:0}).format(cents/100);
 return `<section class="profile-plans" aria-labelledby="profile-plans-title"><div class="section-top"><h2 id="profile-plans-title">${t('plans.title')}</h2></div><div class="plan-grid">${legacyProfile.plans.map(plan=>`<article class="profile-plan" data-plan="${plan.id}">${plan.bestChoice?`<span class="plan-badge">${t('plans.bestChoice')}</span>`:''}<div class="plan-head"><h3>${t('plans.'+plan.id+'.name')}</h3><div class="plan-price">${plan.launchPrice?`<s>${price(plan.price)}</s><span class="plan-offer">${price(plan.launchPrice)}</span>`:`<span class="plan-offer">${price(plan.price)}</span>`}</div></div><p>${t('plans.'+plan.id+'.description')}</p><span class="plan-meta">${plan.bestChoice?t('plans.annual.meta',{monthly:price(Math.round(plan.launchPrice/plan.months))}):t(plan.id==='free'?'plans.free.meta':'plans.launchPrice')}</span></article>`).join('')}</div></section>`;
}
