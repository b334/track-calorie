class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
  }

  // Public methods
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const removeItemIndex = this._meals.findIndex((meal) => meal.id === id);
    if (removeItemIndex !== -1) {
      const removeItemCalories = this._meals[removeItemIndex].calories;
      this._totalCalories -= removeItemCalories;
      this._meals.splice(removeItemIndex, 1);
      this._render();
    }
  }

  removeWorkout(id) {
    const removeItemIndex = this._workouts.findIndex((meal) => meal.id === id);
    if (removeItemIndex !== -1) {
      const removeItemCalories = this._workouts[removeItemIndex].calories;
      this._totalCalories += removeItemCalories;
      this._workouts.splice(removeItemIndex, 1);
      this._render();
    }
  }

  reset() {
    this._meals = [];
    this._workouts = [];
    this._totalCalories = 0;
    this._render();
  }

  setLimit(calorie_limit) {
    this._calorieLimit = calorie_limit;
    this._displayCaloriesLimit();
    this._render();
  }

  // Private methods
  _displayCaloriesTotal() {
    document.getElementById('calories-total').textContent = this._totalCalories;
  }

  _displayCaloriesLimit() {
    document.getElementById('calories-limit').textContent = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumed = this._meals.reduce((acc, meal) => acc + meal.calories, 0);
    document.getElementById('calories-consumed').textContent = caloriesConsumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurned = this._workouts.reduce((acc, workout) => acc + workout.calories, 0);
    document.getElementById('calories-burned').textContent = caloriesBurned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById('calories-remaining');
    const progressEl = document.getElementById('calorie-progress');
    const caloriesRemaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.textContent = caloriesRemaining;
    if (caloriesRemaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
      caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
      progressEl.classList.add('bg-danger');
      progressEl.classList.remove('bg-success');
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
      caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
      progressEl.classList.remove('bg-danger');
      progressEl.classList.add('bg-success');
    }
  }

  _displayCalorieProgress() {
    let progress = (this._totalCalories / this._calorieLimit) * 100;
    progress = Math.min(progress, 100);
    document.getElementById('calorie-progress').style.width = `${progress}%`;
  }

  _displayNewMeal(meal) {
    const mealItemsEl = document.getElementById('meal-items');
    const mealItemEl = document.createElement('div');
    mealItemEl.className = 'card my-2';
    mealItemEl.setAttribute('data-id', meal.id);
    mealItemEl.innerHTML = `     
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">${meal.calories}</div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>      
    `;
    mealItemsEl.appendChild(mealItemEl);
  }

  _displayNewWorkout(workout) {
    const workoutItemsEl = document.getElementById('workout-items');
    const workoutItemEl = document.createElement('div');
    workoutItemEl.className = 'card my-2';
    workoutItemEl.setAttribute('data-id', workout.id);

    workoutItemEl.innerHTML = `     
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">${workout.calories}</div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>      
    `;
    workoutItemsEl.appendChild(workoutItemEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class App {
  constructor() {
    this._calorieTracker = new CalorieTracker();
    // add eventlisteners
    document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
    document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
    document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
    document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
    document.getElementById('filter-meals').addEventListener('input', this._filterItems.bind(this, 'meal'));
    document.getElementById('filter-workouts').addEventListener('input', this._filterItems.bind(this, 'workout'));
    document.getElementById('reset').addEventListener('click', this._reset.bind(this));
    document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // Validate inputs
    if (name.value === '' || calories.value === '') {
      alert('Please fill in all the fields');
      return;
    }
    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value);
      this._calorieTracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._calorieTracker.addWorkout(workout);
    }
    name.value = '';
    calories.value = '';
    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, { toggle: true });
  }

  _removeItem(type, e) {
    if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
      if (confirm('Do you want to delete the item?')) {
        const id = e.target.closest('.card').getAttribute('data-id');
        type === 'meal' ? this._calorieTracker.removeMeal(id) : this._calorieTracker.removeWorkout(id);
        e.target.closest('.card').remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items>.card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _clearItems(type) {
    const lists = document.getElementById(`${type}-items`);
    while (lists.firstChild) {
      lists.firstChild.remove();
    }
    document.getElementById(`filter-${type}s`).value = '';
  }
  _reset() {
    this._clearItems('meal');
    this._clearItems('workout');
    this._calorieTracker.reset();
  }

  _setLimit(e) {
    e.preventDefault();
    const limitEl = document.getElementById('limit');

    if (limitEl.value === '') {
      alert('Please add value for Limit');
      return;
    }
    this._calorieTracker.setLimit(+limitEl.value);
    limitEl.value = '';

    const modalEl = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
