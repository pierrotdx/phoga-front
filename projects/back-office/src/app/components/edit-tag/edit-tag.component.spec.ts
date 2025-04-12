import { ITag } from '@shared/public-api';
import { EditTagTestUtils } from './edit-tag.test-utils';
import { ITagVM } from '@back-office/app/models';
import { Endpoint, EndpointId } from '@back-office/endpoints-context';
import { test } from 'ramda';

fdescribe('EditTagComponent', () => {
  let testUtils: EditTagTestUtils;

  beforeEach(async () => {
    testUtils = new EditTagTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    testUtils.expectComponentToBeCreated();
  });

  it('should display the tag form', () => {
    testUtils.expectTagFormToBeDisplayed();
  });

  describe("the 'Delete' button", () => {
    describe('when there is no input id', () => {
      it('should not be displayed', () => {
        testUtils.expectDeleteButtonToBe('not displayed');
      });
    });

    describe('when there is an input id', () => {
      const tagId: ITag['_id'] = 'tag-id';

      beforeEach(async () => {
        testUtils.setIdInput(tagId);
        await testUtils.whenStable();
      });

      it('should be displayed', async () => {
        testUtils.expectDeleteButtonToBe('displayed');
      });

      it('should send a delete request to the API', () => {
        testUtils.clickOnDeleteButton();
        testUtils.expectDeleteTagRequestToBeSentWithId(tagId);
      });
    });
  });

  describe('onSave', () => {
    const tagVM: ITagVM = { name: 'tag name' };

    describe('when the tag already existed before', () => {
      const updatedTag: ITag = { ...tagVM, _id: 'tag-id' };

      beforeEach(async () => {
        testUtils.setIdInput(updatedTag._id);
        await testUtils.whenStable();
      });

      it('should send an API request to update the tag and then navigate to the tags page', async () => {
        await testUtils.onSave(tagVM);

        testUtils.expectUpdateTagRequestToBeSentWith(updatedTag);
        testUtils.expectNavigationTo(EndpointId.AdminTag);
      });
    });

    describe('when the tag did not exist before', () => {
      it('should send an API request to create the tag and then navigate to the tags page', async () => {
        await testUtils.onSave(tagVM);

        testUtils.expectAddTagRequestToBeSentWith(tagVM);
        testUtils.expectNavigationTo(EndpointId.AdminTag);
      });
    });
  });

  describe('onCancel', () => {
    it('should navigate to the tags page', async () => {
      await testUtils.onCancel();

      testUtils.expectNavigationTo(EndpointId.AdminTag);
    });
  });
});
