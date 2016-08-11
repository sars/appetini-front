import React, { PropTypes } from 'react';
import Button from 'components/Button/Button';
import { reduxForm } from 'redux-form';
import styles from './styles.scss';
import { Link } from 'react-router';
import BaseLunchForm from './BaseLunchForm';

@reduxForm(
  {
    form: 'draftLunchForm',
    fields: ['cook_id', 'photos_temp_image_ids', 'initial_price', 'accept_rules', 'description',
      'dishes[].id', 'dishes[].name', 'dishes[].size', 'dishes[].dish_type', 'dishes[]._destroy',
      'removing_photos', 'dishes_count', 'photos']
    // https://github.com/erikras/redux-form/issues/621
    // https://github.com/erikras/redux-form/issues/514
    // initialValues: {
    //   dishes: [{name: '', size: ''}]
    // }
  }
)
export default class DraftLunchForm extends BaseLunchForm {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.object,
    acceptRules: PropTypes.bool,
    submitting: PropTypes.bool,
    title: PropTypes.string.isRequired,
    sendLabel: PropTypes.string.isRequired
  };

  render() {
    const { fields, title, acceptRules, handleSubmit, submitting, sendLabel } = this.props;

    return (
      <form className={styles.root} onSubmit={handleSubmit}>
        <h1>{title}</h1>
        {this.descriptionField()}
        {this.photosField()}
        {this.dishesField()}
        {this.priceField()}
        {acceptRules && this.acceptRulesField()}
        <div className={styles.acceptRules}>
          {this.submitButton(sendLabel, submitting)}
          <Link className={styles.linkButton} to={`/cooks/${fields.cook_id.value}/draft_lunches`}>
            <Button flat outlined label="К списку моих обедов"/>
          </Link>
        </div>
      </form>
    );
  }
}
