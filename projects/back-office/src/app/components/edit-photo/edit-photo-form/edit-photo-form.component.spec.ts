import { DebugElement } from '@angular/core';
import { EditPhotoFormTestUtils } from './edit-photo-form.test-utils';
import { Photo } from '@shared/photo-context';
import { fakeAsync, tick } from '@angular/core/testing';

describe('EditPhotoFormComponent', () => {
  let testUtils: EditPhotoFormTestUtils;

  beforeEach(async () => {
    testUtils = new EditPhotoFormTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    expect(testUtils.component).toBeTruthy();
  });

  describe('edit photo form', () => {
    describe('when the view model exists', () => {
      beforeEach(() => {
        const photo = new Photo('dumb photo');
        testUtils.setPhoto(photo);
      });

      it('should be displayed', () => {
        const formId = 'edit-photo-form';
        testUtils.expectElementToBeDisplayed(formId);
      });

      it('should display the image-buffer edit form', () => {
        const imageBufferForm = 'edit-image-buffer';
        testUtils.expectElementToBeDisplayed(imageBufferForm);
      });

      it('should display the metadata edit form', () => {
        const metadataForm = 'edit-metadata';
        testUtils.expectElementToBeDisplayed(metadataForm);
      });

      describe('the submit button', () => {
        const submitBtnId = 'submit-btn';
        let submitBtn: DebugElement;

        beforeEach(() => {
          submitBtn = testUtils.getElementById(submitBtnId);
        });

        it('should be displayed', () => {
          testUtils.expectElementToBeDisplayed(submitBtnId);
        });

        describe('when the form is not valid', () => {
          beforeEach(() => {
            testUtils.setIsValid(false);
          });

          it('should be disabled ', () => {
            expect(submitBtn.nativeElement.disabled).toBeTrue();
          });
        });
      });

      describe('the cancel button', () => {
        it('should be displayed', () => {
          const cancelBtnId = 'cancel-btn';
          testUtils.expectElementToBeDisplayed(cancelBtnId);
        });
      });
    });
  });
});
