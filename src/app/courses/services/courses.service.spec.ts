import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Course } from "../model/course";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { HttpErrorResponse } from "@angular/common/http";
import { Lesson } from "../model/lesson";

describe('CoursesService', () => {

  let coursesService: CoursesService,
  httpTestingController:HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[ 
        CoursesService,
      ]
    })

    httpTestingController= TestBed.inject(HttpTestingController);

    coursesService = TestBed.inject(CoursesService); 
    
  })

  it('should retrieve all courses', () => {
    
    coursesService.findAllCourses().subscribe(
      {
        next: (courses : Course[]) => {

         
          expect(courses).toBeTruthy('No courses returned'); 

          expect(courses.length).toBe(12, 'Incrorrect number of courses');

          const course = courses.find( (course) => course.id === 12);

          expect(course.titles.description).toBe('Angular Testing Course');

        } 
      }
    )

    const req = httpTestingController.expectOne('/api/courses'); //httpTestingController will create a mock httpRequest 

    // console.log('req --> ',req);

    expect(req.request.method).toEqual('GET');

    req.flush({payload: Object.values(COURSES)}); // provide somme test data for findAllCourses() call
  })

  it('sould retrieve course by id', () => {
    coursesService.findCourseById(12).subscribe(
      {
        next:(course) => {

          // console.log('course --> ', course);
          expect(course).toBeTruthy;

          expect(course.id).toBe(12);

          expect(course.titles.description).toBe('Angular Testing Course')

        }
      }
    )
    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toBe('GET');

    req.flush(COURSES[12])
  })

  it('it should save course data', () => {

    let changes:Partial<Course> = {
      titles :{
        description:`changes`
      }
    }

    coursesService.saveCourse(12,changes).subscribe(
      {
        next: (changes) => {
          console.log('changes', changes);

          expect(changes.titles.description).toBe('changes');
        }
      }
    )
    // set mock http request
    const req = httpTestingController.expectOne('/api/courses/12');
    // validate the type of request
    expect(req.request.method).toEqual('PUT');

    expect(req.request.body.titles.description).toBe(changes.titles.description);

    const response = {
      ...COURSES[12], 
      ...changes
    }

    req.flush(response);

  })

  it('should give an error if save fails', () => {

    let changes:Partial<Course> = {
      titles :{
        description:`changes`
      }
    }

    coursesService.saveCourse(12, changes).subscribe(
      {
        next : () => fail('the save course operation should  have faild'),
        error:(error: HttpErrorResponse) =>{
          expect(error.status).toBe(500)
        }
      }
    )

    const req = httpTestingController.expectOne('/api/courses/12');

    // validate the type of request
    expect(req.request.method).toEqual('PUT');

    req.flush('save course failed',{status: 500, statusText:'Internal Server error'})

  })

  it('should find lessons with a giving course id', () => {

    coursesService.findLessons(12).subscribe(
      {
        next: (lessons:Lesson[]) => {

          expect(lessons).toBeTruthy();

        }
      }
    )
    const req = httpTestingController.expectOne( req => req.url ===`/api/lessons`);

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toBe('12');
    expect(req.request.params.get('filter')).toBe('');
    expect(req.request.params.get('sortOrder')).toBe('asc');
    expect(req.request.params.get('pageNumber')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('3');

    req.flush({payload : findLessonsForCourse(12).slice(0, 3)})
  })

  afterEach( () => {
    httpTestingController.verify(); // verifie que uniquement l'api passé à expectOne est appellée
  })

})