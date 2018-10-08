import { K3frontPage } from './app.po';

describe('k3front App', function() {
  let page: K3frontPage;

  beforeEach(() => {
    page = new K3frontPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
