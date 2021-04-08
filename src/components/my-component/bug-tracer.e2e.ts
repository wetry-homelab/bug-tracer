import { newE2EPage } from '@stencil/core/testing';

describe('bug-tracer', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<bug-tracer></bug-tracer>');
    const element = await page.find('my-component');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<bug-tracer></bug-tracer>');
    const component = await page.find('bug-tracer');
    const element = await page.find('bug-tracer >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
