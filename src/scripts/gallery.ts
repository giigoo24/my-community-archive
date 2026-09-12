type Side = 'left' | 'right';
const sides: Side[] = ['left', 'right'];
const mobile = matchMedia('(max-width: 767px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const templates = new Map(Array.from(document.querySelectorAll<HTMLTemplateElement>('template[data-project-template]')).map(t => [t.dataset.projectTemplate!, t]));
const active: Partial<Record<Side, string>> = {};
const openers: Partial<Record<Side, HTMLElement>> = {};
const closingTimers: Partial<Record<Side, ReturnType<typeof setTimeout>>> = {};
let order: Side[] = [];
let selected: Side = 'left';

function selectGroup(side: Side) {
  selected = side;
  document.querySelectorAll<HTMLElement>('[data-group]').forEach(el => el.dataset.selected = String(el.dataset.group === side));
  document.querySelectorAll<HTMLButtonElement>('[data-switch]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.switch === side)));
}

function sync(focus = false) {
  const url = new URL(location.href);
  let focusTarget: HTMLElement | undefined;
  for (const side of sides) {
    const panel = document.querySelector<HTMLElement>(`[data-panel="${side}"]`)!;
    const base = document.querySelector<HTMLElement>(`[data-group="${side}"] .group-base`)!;
    const slug = url.searchParams.get(side);
    const template = slug ? templates.get(slug) : undefined;
    const valid = template?.dataset.side === side;
    if (valid && slug && template) {
      if (active[side] === slug) continue;
      clearTimeout(closingTimers[side]);
      const scroll = panel.querySelector<HTMLElement>('.panel-scroll')!;
      scroll.replaceChildren(template.content.cloneNode(true));
      const source = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-project]')).find(a => a.dataset.project === slug);
      panel.querySelector<HTMLAnchorElement>('[data-permalink]')!.href = source!.href;
      panel.setAttribute('aria-label', `${scroll.querySelector('h1')!.textContent} — project detail`);
      panel.hidden = false;
      panel.inert = false;
      panel.classList.remove('is-closing');
      // Establish the off-screen position before starting the slide.
      panel.getBoundingClientRect();
      panel.classList.add('is-open');
      base.inert = true;
      scroll.scrollTop = 0;
      active[side] = slug;
      order = [...order.filter(s => s !== side), side];
      if (mobile.matches) selectGroup(side);
      focusTarget = panel.querySelector<HTMLButtonElement>('[data-close]')!;
    } else if (active[side]) {
      delete active[side];
      order = order.filter(s => s !== side);
      panel.inert = true;
      panel.classList.remove('is-open');
      panel.classList.add('is-closing');
      base.inert = false;
      closingTimers[side] = setTimeout(() => { panel.hidden = true; panel.classList.remove('is-closing'); }, reduced.matches ? 0 : 500);
      focusTarget = openers[side] || base.querySelector<HTMLAnchorElement>('a') || undefined;
    }
  }
  if (mobile.matches && order.length) selectGroup(order[order.length - 1]);
  if (focus) focusTarget?.focus({ preventScroll: true });
}

function navigate(url: URL) {
  history.pushState(null, '', url);
  sync(true);
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element) || event.defaultPrevented) return;
  const link = event.target.closest<HTMLAnchorElement>('a[data-project]');
  if (link && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    const side = link.dataset.side as Side;
    openers[side] = link;
    const url = new URL(location.href);
    if (mobile.matches) sides.forEach(s => url.searchParams.delete(s));
    url.searchParams.set(side, link.dataset.project!);
    navigate(url);
    return;
  }
  const close = event.target.closest<HTMLButtonElement>('[data-close]');
  if (close) {
    const url = new URL(location.href);
    url.searchParams.delete(close.dataset.close!);
    navigate(url);
  }
  const group = event.target.closest<HTMLButtonElement>('[data-switch]');
  if (group) {
    const url = new URL(location.href);
    sides.forEach(s => url.searchParams.delete(s));
    if (order.length) { history.pushState(null, '', url); sync(); }
    selectGroup(group.dataset.switch as Side);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !order.length) return;
  const url = new URL(location.href);
  url.searchParams.delete(order[order.length - 1]);
  navigate(url);
});
window.addEventListener('popstate', () => sync(true));
mobile.addEventListener('change', () => selectGroup(order[order.length - 1] || selected));
document.documentElement.classList.add('enhanced');
sync();
