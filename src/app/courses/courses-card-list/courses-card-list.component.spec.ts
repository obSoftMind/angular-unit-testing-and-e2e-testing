import { ComponentFixture, TestBed,waitForAsync } from "@angular/core/testing"
import { CoursesModule } from "../courses.module"
import { CoursesCardListComponent } from "./courses-card-list.component";
import { setupCourses } from "../common/setup-test-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('CoursesCardListComponent', ()=> {

  let component : CoursesCardListComponent,
      fixture : ComponentFixture<CoursesCardListComponent> ,
      el: DebugElement
  
  beforeEach(waitForAsync(
    ()=> {

    TestBed.configureTestingModule({
      imports:[CoursesModule]
    })
    .compileComponents()
    .then( () => {

      fixture = TestBed.createComponent(CoursesCardListComponent);

      component= fixture.componentInstance;

      el = fixture.debugElement;
      
    })
  })) 

  it('should create the component', ()=> {

    expect(component).toBeTruthy();

  })

  it('should display the course list', () => {

    component.courses = setupCourses();

    fixture.detectChanges();

    const card = el.queryAll(By.css('.course-card'));

    expect(card.length).toBe(12, 'Unexpected number of courses');

    
  })

  it('should display the first course', () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    const course = component.courses[0];

    const card = el.query(By.css('.course-card:first-child')),
          title = card.query(By.css('mat-card-title')),
          image = card.query(By.css('img'))

    expect(card).toBeTruthy();

    expect(title.nativeElement.innerText).toBe(course.titles.description);

    expect(image.nativeElement.src).toBe(course.iconUrl);
    
  })

})