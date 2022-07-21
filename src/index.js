import React from 'react';
import ReactDOM from 'react-dom';
import {
  FlexBox,
  Heading,
  FullScreen,
  Progress,
  Appear,
  Slide,
  Deck,
  Text,
  Box,
  Quote,
  Link,
  CodePane,
  Notes
} from 'spectacle';

const theme = {
  fonts: {
    header: '"Open Sans Condensed", Helvetica, Arial, sans-serif',
    text: '"Open Sans Condensed", Helvetica, Arial, sans-serif'
  }
};

const template = () => (
  <FlexBox
    justifyContent="space-between"
    position="absolute"
    bottom={0}
    width={1}
  >
    <Box padding="0 1em">
      <FullScreen />
    </Box>

    <Box padding="1em">
      <Progress size={7} color="#fc6986" />
    </Box>
  </FlexBox>
);

const Presentation = () => (
  <Deck theme={theme} template={template} >
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="h2">
          ✨<i>Finding Unresolved Promises in Javascript</i>✨
        </Heading>
      </FlexBox>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="h2">
          Based on the following materials:
        </Heading>

        <Text fontSize="36px">
          "Finding unresolved promises in JavaScript" article - <Link fontSize="36px">https://swizec.com/blog/finding-unresolved-promises-in-javascript</Link>
        </Text>

        <Text fontSize="36px">
          "Finding broken promises in asynchronous JavaScript programs" paper - <Link fontSize="36px">https://dl.acm.org/doi/10.1145/3276532</Link>
        </Text>

        <Text fontSize="36px">
          MDN docs for Promises - <Link fontSize="36px">https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise</Link>
        </Text>
      </FlexBox>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="h3">
          Quick introduction to Promises
        </Heading>
      </FlexBox>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start">
        <Text>
          A promise represents the result of an asynchronous computation, and is in one of three states:
          <i>"pending"</i>, <i>"fulfilled"</i>, or <i>"rejected"</i>.
        </Text>

        <Text>
          You can create <strong>Promise</strong> like that:
        </Text>

        <CodePane language="javascript">{`
          // immediately resolves with value 17
          const promise = Promise.resolve(17)

          promise.then(
            function resolve(value) {
              console.log({ value })
            },
            function reject(error) {
              console.log({ error })
              throw error
            }
          )
        `}</CodePane>
      </FlexBox>

      <Notes>
        <ul>
          <li>
            Upon creation, a promise is in the pending state, from which it
            can transition to the fulfilled state by invoking a function "resolve" with a result value, or it can
            transition to the rejected state by invoking a function "reject" with an error value.
          </li>

          <li>
            A promise that
            is in the fulfilled or rejected state is also referred to as being "settled". Once settled, the state of a
            promise cannot change again.
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start">
        <Text>
          One more example of creating a <strong>Promise</strong>:
        </Text>

        <CodePane language="javascript">{`
          const promise = new Promise((resolve, reject) => {
            const number = Math.random()
            
            if (number > 0.5) {
              resolve(number)
            } else {
              reject(new Error('An error has occurred')
            }
          })
        `}</CodePane>
      </FlexBox>

      <Notes>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start">
        <Text>
          In practice we usually omit 2nd parameter
        </Text>

        <CodePane language="javascript">{`
          // immediately resolves with value 20
          const promise = Promise.resolve(20)
          promise.then(value => value + 1)
                 .then(value => value + 1)
                 .then(function (value) => { console.log(value) })
                 .catch(err => { console.log(err) }) 💡
        `}</CodePane>
      </FlexBox>

      <Notes>
        <ul>
          <li>
            In practice we usually omit 2nd parameter to focus on fulfilled reaction.
          </li>

          <li>
            Each call to .then creates a new promise, which resolves with the return value of the reaction. Notice that the last .then() call implicitly resolves with undefined. Because in JavaScript a function without a return implicitly returns undefined.
          </li>

          <li>
            Important detail: We can add error handling to a promise chain using .catch()
          </li>

          <li>
            Every promise created by .then implicitly defines a default rejection reaction. This means a .catch() at the end of a chain can react to errors in any of the above promises.
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start">
        <Text>
          Also you can <strong>link promises</strong> by using a promise to resolve another promise
        </Text>

        <CodePane language="javascript">{`
          const firstPromise = Promise.resolve(17) // immediately resolves

          const secondPromise = Promise.reject("foo") // immediately rejects

          firstPromise.then(function(params) {
            return secondPromise
          })
        `}</CodePane>
      </FlexBox>

      <Notes>
        <ul>
          <li>
            The state of firstPromise is now linked to secondPromise. Meaning the unnamed promise created on line 5 gets rejected with "foo".
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading>The End!</Heading>

        <Appear>
          <Text>Of the introduction</Text>
        </Appear>
      </FlexBox>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start">
        <Heading fontSize="h2">
          Pattern 1: Unhandled promise rejection
        </Heading>

        <Text>Quiet often you might see something like this:</Text>

        <CodePane language="javascript">{`
          promise.then(function (val) {
            if (val > 5) {
              console.log(val)
            } else {
              throw new Error("Too small value")
            }
          })
        `}</CodePane>
      </FlexBox>

      <Notes>
        <ul>
          <li>
            A common source of trouble are unhandled promise rejections.
          </li>

          <li>
            This happens when you implicitly reject a promise by throwing an error in your fulfilled reaction.
          </li>

          <li>
            Because the fulfill reaction runs in a separate async context, JavaScript doesn't propagate this error to the main thread. The error gets swallowed and you'll never know it happened.
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start">
        <Heading fontSize="h2">
          Pattern 1: Unhandled promise rejection
        </Heading>

        <Text>Fix:</Text>

        <CodePane language="javascript" highlightRanges={[8]}>{`
          promise.then(function (val) {
            if (val > 5) {
              console.log(val)
            } else {
              throw new Error("Too small value")
            }
          })
          .catch((err) => console.log(err))
        `}</CodePane>
      </FlexBox>

      <Notes>
        <ul>
          <li>
            We can fix this with a .catch() reaction
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start">
        <Heading fontSize="h2">
          Pattern 1: Unhandled promise rejection
        </Heading>

        <Text>BUT! We <strong>didn't re-throw!</strong></Text>

        <CodePane language="javascript">{`
          const promise = Promise.resolve(19)

          promise.then(function (val) {
            throw new Error("Oops")
            return val + 1
          })
            .catch(function (err) {
              console.log(err)
            })
            .then(function (val) {
              console.log(val + 1) // prints NaN
            })
        `}</CodePane>
      </FlexBox>

      <Notes>
        <ul>
          <li>
            If other linked or chained promises rely on this code, the error remains swallowed. Your code keeps running.
          </li>

          <li>
            You're expecting 19 + 1 = 20 but you get NaN thanks to an unexpected error. The implicit promise that .catch() creates is implicitly resolved (not rejected) with undefined
          </li>

          <li>
            Pretty simple example, yes, but imagine how common this pattern becomes in a sprawling codebase where any function may throw for any reason.
          </li>

          <li>
            The fix here is similar - to throw another Error in .catch()
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start">
        <Heading fontSize="h2">
          Pattern 2: Unsettled promises
        </Heading>

        <Quote>
          Every new promise is in the pending state until resolved or rejected. However, not settling a promise results in a dead promise, forever pending, preventing the execution of reactions that depend on the promise being settled.
        </Quote>

        <CodePane language="javascript">{`
          const firstPromise = new Promise((resolve, reject) => null)
          
          const secondPromise = Promise.resolve(17)
    
          firstPromise.then((result) => secondPromise)
            .then((value) => value + 1)
            .then((value) => console.log(value)) // expecting 18
        `}</CodePane>
      </FlexBox>

      <Notes>
        <ul>
          <li>
            This unresolved promises are the hardest to find. You cannot know from outside whether a promise is slow or dead.
          </li>

          <li>
            Look at the example. The last promise chains onto firstPromise, which neither resolves nor rejects. You can keep this code running forever and it's never going to print a value.
          </li>

          <li>
            Again, this is a silly example but imagine a sprawling codebase with dozens of programmers. It may not be obvious that a function won't resolve its promise in some cases.
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start">
        <Heading fontSize="h2" margin="0px">
          Pattern 3: Implicit returns and reactions
        </Heading>

        <Quote fontSize={36}>
          Promise chains break silently when the developer forgets to explicitly include a return statement
        </Quote>

        <CodePane language="javascript">{`
          handleRequest(handler) {
            if (typeof handler === 'function') {
                const promise = handler(this)
  
                if (promise instanceof Promise) {
                    promise.then(result => {
                        ...
                        return result
                    }).catch(reason => {
                        this.handleError('function failed')
                        ...
                        return reason
                    })
                }
            }
          }
        `}</CodePane>
      </FlexBox>

      <Notes>
        <ul>
          <li>
            The handleRequest method uses a developer-provided handlers to asynchronously handle some business-logic. A handler can be either a callback or a promise.
          </li>

          <li>
            If the promise resolves and calls your anonymous handler, this code returns the result. If it rejects, it returns a reason.
          </li>

          <li>
            However, those returns are inside a promise reaction. But the promise isn't returned! The result of reacting to the handler promise is lost.
          </li>

          <li>
            You, as the user of this library, cannot handle the fulfill/reject reactions of promises returned by your own handlers.
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
        <Heading fontSize="h2">
          What can we do in practice?
        </Heading>

        <Text>
          <ol style={{ margin: 0 }}>
            <li>
              Use <i>async/await</i> syntax
            </li>

            <li>
              Use some logging
            </li>
          </ol>
        </Text>

        <CodePane language="javascript">{`
          // logs a helpful error message when there's an unhandled promise rejection
          process.on("unhandledRejection", (err, promise) => {
            const stack = err instanceof Error ? err.stack : ""
            const message = err instanceof Error ? err.message : err
          
            Logger.error("Unhandled promise rejection", {
              message,
              stack,
              promise,
            })
          })
        `}</CodePane>
      </FlexBox>

      <Notes>
        <ul>
          <li>
            Keep common anti-patterns in mind and avoid writing fundamentally broken code.
          </li>

          <li>
            Using async/await makes many of these patterns less likely.
          </li>

          <li>
            We can use some logging utils for unhandled rejections with a full stack trace.
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="h2">
          Q&A
        </Heading>
      </FlexBox>
    </Slide>
  </Deck>
);

ReactDOM.render(<Presentation />, document.getElementById('root'));
