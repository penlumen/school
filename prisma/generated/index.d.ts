
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model AccessControl
 * 
 */
export type AccessControl = $Result.DefaultSelection<Prisma.$AccessControlPayload>
/**
 * Model School
 * 
 */
export type School = $Result.DefaultSelection<Prisma.$SchoolPayload>
/**
 * Model Branch
 * 
 */
export type Branch = $Result.DefaultSelection<Prisma.$BranchPayload>
/**
 * Model BranchAccess
 * 
 */
export type BranchAccess = $Result.DefaultSelection<Prisma.$BranchAccessPayload>
/**
 * Model Student
 * 
 */
export type Student = $Result.DefaultSelection<Prisma.$StudentPayload>
/**
 * Model Class
 * 
 */
export type Class = $Result.DefaultSelection<Prisma.$ClassPayload>
/**
 * Model Subject
 * 
 */
export type Subject = $Result.DefaultSelection<Prisma.$SubjectPayload>
/**
 * Model Grade
 * 
 */
export type Grade = $Result.DefaultSelection<Prisma.$GradePayload>
/**
 * Model Result
 * 
 */
export type Result = $Result.DefaultSelection<Prisma.$ResultPayload>
/**
 * Model Assessments
 * 
 */
export type Assessments = $Result.DefaultSelection<Prisma.$AssessmentsPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ROOT: 'ROOT',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  PARENT: 'PARENT'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accessControl`: Exposes CRUD operations for the **AccessControl** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccessControls
    * const accessControls = await prisma.accessControl.findMany()
    * ```
    */
  get accessControl(): Prisma.AccessControlDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.school`: Exposes CRUD operations for the **School** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Schools
    * const schools = await prisma.school.findMany()
    * ```
    */
  get school(): Prisma.SchoolDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.branch`: Exposes CRUD operations for the **Branch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Branches
    * const branches = await prisma.branch.findMany()
    * ```
    */
  get branch(): Prisma.BranchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.branchAccess`: Exposes CRUD operations for the **BranchAccess** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BranchAccesses
    * const branchAccesses = await prisma.branchAccess.findMany()
    * ```
    */
  get branchAccess(): Prisma.BranchAccessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.student`: Exposes CRUD operations for the **Student** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Students
    * const students = await prisma.student.findMany()
    * ```
    */
  get student(): Prisma.StudentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.class`: Exposes CRUD operations for the **Class** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Classes
    * const classes = await prisma.class.findMany()
    * ```
    */
  get class(): Prisma.ClassDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subject`: Exposes CRUD operations for the **Subject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subjects
    * const subjects = await prisma.subject.findMany()
    * ```
    */
  get subject(): Prisma.SubjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.grade`: Exposes CRUD operations for the **Grade** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Grades
    * const grades = await prisma.grade.findMany()
    * ```
    */
  get grade(): Prisma.GradeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.result`: Exposes CRUD operations for the **Result** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Results
    * const results = await prisma.result.findMany()
    * ```
    */
  get result(): Prisma.ResultDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assessments`: Exposes CRUD operations for the **Assessments** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Assessments
    * const assessments = await prisma.assessments.findMany()
    * ```
    */
  get assessments(): Prisma.AssessmentsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    AccessControl: 'AccessControl',
    School: 'School',
    Branch: 'Branch',
    BranchAccess: 'BranchAccess',
    Student: 'Student',
    Class: 'Class',
    Subject: 'Subject',
    Grade: 'Grade',
    Result: 'Result',
    Assessments: 'Assessments'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "accessControl" | "school" | "branch" | "branchAccess" | "student" | "class" | "subject" | "grade" | "result" | "assessments"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      AccessControl: {
        payload: Prisma.$AccessControlPayload<ExtArgs>
        fields: Prisma.AccessControlFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccessControlFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccessControlFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload>
          }
          findFirst: {
            args: Prisma.AccessControlFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccessControlFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload>
          }
          findMany: {
            args: Prisma.AccessControlFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload>[]
          }
          create: {
            args: Prisma.AccessControlCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload>
          }
          createMany: {
            args: Prisma.AccessControlCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccessControlCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload>[]
          }
          delete: {
            args: Prisma.AccessControlDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload>
          }
          update: {
            args: Prisma.AccessControlUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload>
          }
          deleteMany: {
            args: Prisma.AccessControlDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccessControlUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccessControlUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload>[]
          }
          upsert: {
            args: Prisma.AccessControlUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessControlPayload>
          }
          aggregate: {
            args: Prisma.AccessControlAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccessControl>
          }
          groupBy: {
            args: Prisma.AccessControlGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccessControlGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccessControlCountArgs<ExtArgs>
            result: $Utils.Optional<AccessControlCountAggregateOutputType> | number
          }
        }
      }
      School: {
        payload: Prisma.$SchoolPayload<ExtArgs>
        fields: Prisma.SchoolFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SchoolFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SchoolFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload>
          }
          findFirst: {
            args: Prisma.SchoolFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SchoolFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload>
          }
          findMany: {
            args: Prisma.SchoolFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload>[]
          }
          create: {
            args: Prisma.SchoolCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload>
          }
          createMany: {
            args: Prisma.SchoolCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SchoolCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload>[]
          }
          delete: {
            args: Prisma.SchoolDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload>
          }
          update: {
            args: Prisma.SchoolUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload>
          }
          deleteMany: {
            args: Prisma.SchoolDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SchoolUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SchoolUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload>[]
          }
          upsert: {
            args: Prisma.SchoolUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolPayload>
          }
          aggregate: {
            args: Prisma.SchoolAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSchool>
          }
          groupBy: {
            args: Prisma.SchoolGroupByArgs<ExtArgs>
            result: $Utils.Optional<SchoolGroupByOutputType>[]
          }
          count: {
            args: Prisma.SchoolCountArgs<ExtArgs>
            result: $Utils.Optional<SchoolCountAggregateOutputType> | number
          }
        }
      }
      Branch: {
        payload: Prisma.$BranchPayload<ExtArgs>
        fields: Prisma.BranchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BranchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BranchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          findFirst: {
            args: Prisma.BranchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BranchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          findMany: {
            args: Prisma.BranchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>[]
          }
          create: {
            args: Prisma.BranchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          createMany: {
            args: Prisma.BranchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BranchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>[]
          }
          delete: {
            args: Prisma.BranchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          update: {
            args: Prisma.BranchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          deleteMany: {
            args: Prisma.BranchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BranchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BranchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>[]
          }
          upsert: {
            args: Prisma.BranchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          aggregate: {
            args: Prisma.BranchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBranch>
          }
          groupBy: {
            args: Prisma.BranchGroupByArgs<ExtArgs>
            result: $Utils.Optional<BranchGroupByOutputType>[]
          }
          count: {
            args: Prisma.BranchCountArgs<ExtArgs>
            result: $Utils.Optional<BranchCountAggregateOutputType> | number
          }
        }
      }
      BranchAccess: {
        payload: Prisma.$BranchAccessPayload<ExtArgs>
        fields: Prisma.BranchAccessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BranchAccessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BranchAccessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload>
          }
          findFirst: {
            args: Prisma.BranchAccessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BranchAccessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload>
          }
          findMany: {
            args: Prisma.BranchAccessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload>[]
          }
          create: {
            args: Prisma.BranchAccessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload>
          }
          createMany: {
            args: Prisma.BranchAccessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BranchAccessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload>[]
          }
          delete: {
            args: Prisma.BranchAccessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload>
          }
          update: {
            args: Prisma.BranchAccessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload>
          }
          deleteMany: {
            args: Prisma.BranchAccessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BranchAccessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BranchAccessUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload>[]
          }
          upsert: {
            args: Prisma.BranchAccessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchAccessPayload>
          }
          aggregate: {
            args: Prisma.BranchAccessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBranchAccess>
          }
          groupBy: {
            args: Prisma.BranchAccessGroupByArgs<ExtArgs>
            result: $Utils.Optional<BranchAccessGroupByOutputType>[]
          }
          count: {
            args: Prisma.BranchAccessCountArgs<ExtArgs>
            result: $Utils.Optional<BranchAccessCountAggregateOutputType> | number
          }
        }
      }
      Student: {
        payload: Prisma.$StudentPayload<ExtArgs>
        fields: Prisma.StudentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findFirst: {
            args: Prisma.StudentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findMany: {
            args: Prisma.StudentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          create: {
            args: Prisma.StudentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          createMany: {
            args: Prisma.StudentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          delete: {
            args: Prisma.StudentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          update: {
            args: Prisma.StudentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          deleteMany: {
            args: Prisma.StudentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          upsert: {
            args: Prisma.StudentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          aggregate: {
            args: Prisma.StudentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudent>
          }
          groupBy: {
            args: Prisma.StudentGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentCountArgs<ExtArgs>
            result: $Utils.Optional<StudentCountAggregateOutputType> | number
          }
        }
      }
      Class: {
        payload: Prisma.$ClassPayload<ExtArgs>
        fields: Prisma.ClassFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClassFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClassFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload>
          }
          findFirst: {
            args: Prisma.ClassFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClassFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload>
          }
          findMany: {
            args: Prisma.ClassFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload>[]
          }
          create: {
            args: Prisma.ClassCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload>
          }
          createMany: {
            args: Prisma.ClassCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClassCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload>[]
          }
          delete: {
            args: Prisma.ClassDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload>
          }
          update: {
            args: Prisma.ClassUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload>
          }
          deleteMany: {
            args: Prisma.ClassDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClassUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClassUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload>[]
          }
          upsert: {
            args: Prisma.ClassUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassPayload>
          }
          aggregate: {
            args: Prisma.ClassAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClass>
          }
          groupBy: {
            args: Prisma.ClassGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClassGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClassCountArgs<ExtArgs>
            result: $Utils.Optional<ClassCountAggregateOutputType> | number
          }
        }
      }
      Subject: {
        payload: Prisma.$SubjectPayload<ExtArgs>
        fields: Prisma.SubjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          findFirst: {
            args: Prisma.SubjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          findMany: {
            args: Prisma.SubjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>[]
          }
          create: {
            args: Prisma.SubjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          createMany: {
            args: Prisma.SubjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>[]
          }
          delete: {
            args: Prisma.SubjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          update: {
            args: Prisma.SubjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          deleteMany: {
            args: Prisma.SubjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>[]
          }
          upsert: {
            args: Prisma.SubjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          aggregate: {
            args: Prisma.SubjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubject>
          }
          groupBy: {
            args: Prisma.SubjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubjectCountArgs<ExtArgs>
            result: $Utils.Optional<SubjectCountAggregateOutputType> | number
          }
        }
      }
      Grade: {
        payload: Prisma.$GradePayload<ExtArgs>
        fields: Prisma.GradeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GradeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GradeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload>
          }
          findFirst: {
            args: Prisma.GradeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GradeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload>
          }
          findMany: {
            args: Prisma.GradeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload>[]
          }
          create: {
            args: Prisma.GradeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload>
          }
          createMany: {
            args: Prisma.GradeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GradeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload>[]
          }
          delete: {
            args: Prisma.GradeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload>
          }
          update: {
            args: Prisma.GradeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload>
          }
          deleteMany: {
            args: Prisma.GradeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GradeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GradeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload>[]
          }
          upsert: {
            args: Prisma.GradeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradePayload>
          }
          aggregate: {
            args: Prisma.GradeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGrade>
          }
          groupBy: {
            args: Prisma.GradeGroupByArgs<ExtArgs>
            result: $Utils.Optional<GradeGroupByOutputType>[]
          }
          count: {
            args: Prisma.GradeCountArgs<ExtArgs>
            result: $Utils.Optional<GradeCountAggregateOutputType> | number
          }
        }
      }
      Result: {
        payload: Prisma.$ResultPayload<ExtArgs>
        fields: Prisma.ResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload>
          }
          findFirst: {
            args: Prisma.ResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload>
          }
          findMany: {
            args: Prisma.ResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload>[]
          }
          create: {
            args: Prisma.ResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload>
          }
          createMany: {
            args: Prisma.ResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload>[]
          }
          delete: {
            args: Prisma.ResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload>
          }
          update: {
            args: Prisma.ResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload>
          }
          deleteMany: {
            args: Prisma.ResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResultUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload>[]
          }
          upsert: {
            args: Prisma.ResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResultPayload>
          }
          aggregate: {
            args: Prisma.ResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResult>
          }
          groupBy: {
            args: Prisma.ResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResultCountArgs<ExtArgs>
            result: $Utils.Optional<ResultCountAggregateOutputType> | number
          }
        }
      }
      Assessments: {
        payload: Prisma.$AssessmentsPayload<ExtArgs>
        fields: Prisma.AssessmentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssessmentsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssessmentsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload>
          }
          findFirst: {
            args: Prisma.AssessmentsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssessmentsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload>
          }
          findMany: {
            args: Prisma.AssessmentsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload>[]
          }
          create: {
            args: Prisma.AssessmentsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload>
          }
          createMany: {
            args: Prisma.AssessmentsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssessmentsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload>[]
          }
          delete: {
            args: Prisma.AssessmentsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload>
          }
          update: {
            args: Prisma.AssessmentsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload>
          }
          deleteMany: {
            args: Prisma.AssessmentsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssessmentsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssessmentsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload>[]
          }
          upsert: {
            args: Prisma.AssessmentsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessmentsPayload>
          }
          aggregate: {
            args: Prisma.AssessmentsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssessments>
          }
          groupBy: {
            args: Prisma.AssessmentsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssessmentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssessmentsCountArgs<ExtArgs>
            result: $Utils.Optional<AssessmentsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    accessControl?: AccessControlOmit
    school?: SchoolOmit
    branch?: BranchOmit
    branchAccess?: BranchAccessOmit
    student?: StudentOmit
    class?: ClassOmit
    subject?: SubjectOmit
    grade?: GradeOmit
    result?: ResultOmit
    assessments?: AssessmentsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    students: number
    access: number
    control: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    students?: boolean | UserCountOutputTypeCountStudentsArgs
    access?: boolean | UserCountOutputTypeCountAccessArgs
    control?: boolean | UserCountOutputTypeCountControlArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountStudentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BranchAccessWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountControlArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessControlWhereInput
  }


  /**
   * Count Type SchoolCountOutputType
   */

  export type SchoolCountOutputType = {
    users: number
    branches: number
    access: number
  }

  export type SchoolCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | SchoolCountOutputTypeCountUsersArgs
    branches?: boolean | SchoolCountOutputTypeCountBranchesArgs
    access?: boolean | SchoolCountOutputTypeCountAccessArgs
  }

  // Custom InputTypes
  /**
   * SchoolCountOutputType without action
   */
  export type SchoolCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SchoolCountOutputType
     */
    select?: SchoolCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SchoolCountOutputType without action
   */
  export type SchoolCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * SchoolCountOutputType without action
   */
  export type SchoolCountOutputTypeCountBranchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BranchWhereInput
  }

  /**
   * SchoolCountOutputType without action
   */
  export type SchoolCountOutputTypeCountAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BranchAccessWhereInput
  }


  /**
   * Count Type BranchCountOutputType
   */

  export type BranchCountOutputType = {
    grades: number
    classes: number
    students: number
    control: number
    access: number
  }

  export type BranchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    grades?: boolean | BranchCountOutputTypeCountGradesArgs
    classes?: boolean | BranchCountOutputTypeCountClassesArgs
    students?: boolean | BranchCountOutputTypeCountStudentsArgs
    control?: boolean | BranchCountOutputTypeCountControlArgs
    access?: boolean | BranchCountOutputTypeCountAccessArgs
  }

  // Custom InputTypes
  /**
   * BranchCountOutputType without action
   */
  export type BranchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchCountOutputType
     */
    select?: BranchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BranchCountOutputType without action
   */
  export type BranchCountOutputTypeCountGradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GradeWhereInput
  }

  /**
   * BranchCountOutputType without action
   */
  export type BranchCountOutputTypeCountClassesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassWhereInput
  }

  /**
   * BranchCountOutputType without action
   */
  export type BranchCountOutputTypeCountStudentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
  }

  /**
   * BranchCountOutputType without action
   */
  export type BranchCountOutputTypeCountControlArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessControlWhereInput
  }

  /**
   * BranchCountOutputType without action
   */
  export type BranchCountOutputTypeCountAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BranchAccessWhereInput
  }


  /**
   * Count Type StudentCountOutputType
   */

  export type StudentCountOutputType = {
    results: number
  }

  export type StudentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    results?: boolean | StudentCountOutputTypeCountResultsArgs
  }

  // Custom InputTypes
  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCountOutputType
     */
    select?: StudentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResultWhereInput
  }


  /**
   * Count Type ClassCountOutputType
   */

  export type ClassCountOutputType = {
    subjects: number
    students: number
  }

  export type ClassCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subjects?: boolean | ClassCountOutputTypeCountSubjectsArgs
    students?: boolean | ClassCountOutputTypeCountStudentsArgs
  }

  // Custom InputTypes
  /**
   * ClassCountOutputType without action
   */
  export type ClassCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassCountOutputType
     */
    select?: ClassCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClassCountOutputType without action
   */
  export type ClassCountOutputTypeCountSubjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubjectWhereInput
  }

  /**
   * ClassCountOutputType without action
   */
  export type ClassCountOutputTypeCountStudentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
  }


  /**
   * Count Type ResultCountOutputType
   */

  export type ResultCountOutputType = {
    assessments: number
  }

  export type ResultCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assessments?: boolean | ResultCountOutputTypeCountAssessmentsArgs
  }

  // Custom InputTypes
  /**
   * ResultCountOutputType without action
   */
  export type ResultCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResultCountOutputType
     */
    select?: ResultCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ResultCountOutputType without action
   */
  export type ResultCountOutputTypeCountAssessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssessmentsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    school_uuid: string | null
    name: string | null
    email: string | null
    password: string | null
    contact: string | null
    alt_contact: string | null
    avatar: string | null
    address: string | null
    role: $Enums.Role | null
    position: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    school_uuid: string | null
    name: string | null
    email: string | null
    password: string | null
    contact: string | null
    alt_contact: string | null
    avatar: string | null
    address: string | null
    role: $Enums.Role | null
    position: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    uuid: number
    school_uuid: number
    name: number
    email: number
    password: number
    contact: number
    alt_contact: number
    avatar: number
    address: number
    role: number
    position: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    uuid?: true
    school_uuid?: true
    name?: true
    email?: true
    password?: true
    contact?: true
    alt_contact?: true
    avatar?: true
    address?: true
    role?: true
    position?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    uuid?: true
    school_uuid?: true
    name?: true
    email?: true
    password?: true
    contact?: true
    alt_contact?: true
    avatar?: true
    address?: true
    role?: true
    position?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    uuid?: true
    school_uuid?: true
    name?: true
    email?: true
    password?: true
    contact?: true
    alt_contact?: true
    avatar?: true
    address?: true
    role?: true
    position?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    uuid: string
    school_uuid: string | null
    name: string | null
    email: string
    password: string
    contact: string | null
    alt_contact: string | null
    avatar: string | null
    address: string | null
    role: $Enums.Role
    position: string
    status: string
    created_at: Date
    updated_at: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    school_uuid?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    contact?: boolean
    alt_contact?: boolean
    avatar?: boolean
    address?: boolean
    role?: boolean
    position?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    school?: boolean | User$schoolArgs<ExtArgs>
    students?: boolean | User$studentsArgs<ExtArgs>
    access?: boolean | User$accessArgs<ExtArgs>
    control?: boolean | User$controlArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    school_uuid?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    contact?: boolean
    alt_contact?: boolean
    avatar?: boolean
    address?: boolean
    role?: boolean
    position?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    school?: boolean | User$schoolArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    school_uuid?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    contact?: boolean
    alt_contact?: boolean
    avatar?: boolean
    address?: boolean
    role?: boolean
    position?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    school?: boolean | User$schoolArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    uuid?: boolean
    school_uuid?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    contact?: boolean
    alt_contact?: boolean
    avatar?: boolean
    address?: boolean
    role?: boolean
    position?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "school_uuid" | "name" | "email" | "password" | "contact" | "alt_contact" | "avatar" | "address" | "role" | "position" | "status" | "created_at" | "updated_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    school?: boolean | User$schoolArgs<ExtArgs>
    students?: boolean | User$studentsArgs<ExtArgs>
    access?: boolean | User$accessArgs<ExtArgs>
    control?: boolean | User$controlArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    school?: boolean | User$schoolArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    school?: boolean | User$schoolArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      school: Prisma.$SchoolPayload<ExtArgs> | null
      students: Prisma.$StudentPayload<ExtArgs>[]
      access: Prisma.$BranchAccessPayload<ExtArgs>[]
      control: Prisma.$AccessControlPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      school_uuid: string | null
      name: string | null
      email: string
      password: string
      contact: string | null
      alt_contact: string | null
      avatar: string | null
      address: string | null
      role: $Enums.Role
      position: string
      status: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    school<T extends User$schoolArgs<ExtArgs> = {}>(args?: Subset<T, User$schoolArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    students<T extends User$studentsArgs<ExtArgs> = {}>(args?: Subset<T, User$studentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    access<T extends User$accessArgs<ExtArgs> = {}>(args?: Subset<T, User$accessArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    control<T extends User$controlArgs<ExtArgs> = {}>(args?: Subset<T, User$controlArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly uuid: FieldRef<"User", 'String'>
    readonly school_uuid: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly contact: FieldRef<"User", 'String'>
    readonly alt_contact: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly position: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'String'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.school
   */
  export type User$schoolArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    where?: SchoolWhereInput
  }

  /**
   * User.students
   */
  export type User$studentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    cursor?: StudentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * User.access
   */
  export type User$accessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    where?: BranchAccessWhereInput
    orderBy?: BranchAccessOrderByWithRelationInput | BranchAccessOrderByWithRelationInput[]
    cursor?: BranchAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BranchAccessScalarFieldEnum | BranchAccessScalarFieldEnum[]
  }

  /**
   * User.control
   */
  export type User$controlArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    where?: AccessControlWhereInput
    orderBy?: AccessControlOrderByWithRelationInput | AccessControlOrderByWithRelationInput[]
    cursor?: AccessControlWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccessControlScalarFieldEnum | AccessControlScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model AccessControl
   */

  export type AggregateAccessControl = {
    _count: AccessControlCountAggregateOutputType | null
    _avg: AccessControlAvgAggregateOutputType | null
    _sum: AccessControlSumAggregateOutputType | null
    _min: AccessControlMinAggregateOutputType | null
    _max: AccessControlMaxAggregateOutputType | null
  }

  export type AccessControlAvgAggregateOutputType = {
    id: number | null
  }

  export type AccessControlSumAggregateOutputType = {
    id: number | null
  }

  export type AccessControlMinAggregateOutputType = {
    id: number | null
    user_uuid: string | null
    branch_uuid: string | null
    access: string | null
  }

  export type AccessControlMaxAggregateOutputType = {
    id: number | null
    user_uuid: string | null
    branch_uuid: string | null
    access: string | null
  }

  export type AccessControlCountAggregateOutputType = {
    id: number
    user_uuid: number
    branch_uuid: number
    access: number
    _all: number
  }


  export type AccessControlAvgAggregateInputType = {
    id?: true
  }

  export type AccessControlSumAggregateInputType = {
    id?: true
  }

  export type AccessControlMinAggregateInputType = {
    id?: true
    user_uuid?: true
    branch_uuid?: true
    access?: true
  }

  export type AccessControlMaxAggregateInputType = {
    id?: true
    user_uuid?: true
    branch_uuid?: true
    access?: true
  }

  export type AccessControlCountAggregateInputType = {
    id?: true
    user_uuid?: true
    branch_uuid?: true
    access?: true
    _all?: true
  }

  export type AccessControlAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessControl to aggregate.
     */
    where?: AccessControlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessControls to fetch.
     */
    orderBy?: AccessControlOrderByWithRelationInput | AccessControlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccessControlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessControls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessControls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccessControls
    **/
    _count?: true | AccessControlCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccessControlAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccessControlSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccessControlMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccessControlMaxAggregateInputType
  }

  export type GetAccessControlAggregateType<T extends AccessControlAggregateArgs> = {
        [P in keyof T & keyof AggregateAccessControl]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccessControl[P]>
      : GetScalarType<T[P], AggregateAccessControl[P]>
  }




  export type AccessControlGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessControlWhereInput
    orderBy?: AccessControlOrderByWithAggregationInput | AccessControlOrderByWithAggregationInput[]
    by: AccessControlScalarFieldEnum[] | AccessControlScalarFieldEnum
    having?: AccessControlScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccessControlCountAggregateInputType | true
    _avg?: AccessControlAvgAggregateInputType
    _sum?: AccessControlSumAggregateInputType
    _min?: AccessControlMinAggregateInputType
    _max?: AccessControlMaxAggregateInputType
  }

  export type AccessControlGroupByOutputType = {
    id: number
    user_uuid: string
    branch_uuid: string
    access: string
    _count: AccessControlCountAggregateOutputType | null
    _avg: AccessControlAvgAggregateOutputType | null
    _sum: AccessControlSumAggregateOutputType | null
    _min: AccessControlMinAggregateOutputType | null
    _max: AccessControlMaxAggregateOutputType | null
  }

  type GetAccessControlGroupByPayload<T extends AccessControlGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccessControlGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccessControlGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccessControlGroupByOutputType[P]>
            : GetScalarType<T[P], AccessControlGroupByOutputType[P]>
        }
      >
    >


  export type AccessControlSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_uuid?: boolean
    branch_uuid?: boolean
    access?: boolean
    user?: boolean | AccessControl$userArgs<ExtArgs>
    branch?: boolean | AccessControl$branchArgs<ExtArgs>
  }, ExtArgs["result"]["accessControl"]>

  export type AccessControlSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_uuid?: boolean
    branch_uuid?: boolean
    access?: boolean
    user?: boolean | AccessControl$userArgs<ExtArgs>
    branch?: boolean | AccessControl$branchArgs<ExtArgs>
  }, ExtArgs["result"]["accessControl"]>

  export type AccessControlSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_uuid?: boolean
    branch_uuid?: boolean
    access?: boolean
    user?: boolean | AccessControl$userArgs<ExtArgs>
    branch?: boolean | AccessControl$branchArgs<ExtArgs>
  }, ExtArgs["result"]["accessControl"]>

  export type AccessControlSelectScalar = {
    id?: boolean
    user_uuid?: boolean
    branch_uuid?: boolean
    access?: boolean
  }

  export type AccessControlOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_uuid" | "branch_uuid" | "access", ExtArgs["result"]["accessControl"]>
  export type AccessControlInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AccessControl$userArgs<ExtArgs>
    branch?: boolean | AccessControl$branchArgs<ExtArgs>
  }
  export type AccessControlIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AccessControl$userArgs<ExtArgs>
    branch?: boolean | AccessControl$branchArgs<ExtArgs>
  }
  export type AccessControlIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AccessControl$userArgs<ExtArgs>
    branch?: boolean | AccessControl$branchArgs<ExtArgs>
  }

  export type $AccessControlPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccessControl"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      branch: Prisma.$BranchPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      user_uuid: string
      branch_uuid: string
      access: string
    }, ExtArgs["result"]["accessControl"]>
    composites: {}
  }

  type AccessControlGetPayload<S extends boolean | null | undefined | AccessControlDefaultArgs> = $Result.GetResult<Prisma.$AccessControlPayload, S>

  type AccessControlCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccessControlFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccessControlCountAggregateInputType | true
    }

  export interface AccessControlDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccessControl'], meta: { name: 'AccessControl' } }
    /**
     * Find zero or one AccessControl that matches the filter.
     * @param {AccessControlFindUniqueArgs} args - Arguments to find a AccessControl
     * @example
     * // Get one AccessControl
     * const accessControl = await prisma.accessControl.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccessControlFindUniqueArgs>(args: SelectSubset<T, AccessControlFindUniqueArgs<ExtArgs>>): Prisma__AccessControlClient<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AccessControl that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccessControlFindUniqueOrThrowArgs} args - Arguments to find a AccessControl
     * @example
     * // Get one AccessControl
     * const accessControl = await prisma.accessControl.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccessControlFindUniqueOrThrowArgs>(args: SelectSubset<T, AccessControlFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccessControlClient<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccessControl that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessControlFindFirstArgs} args - Arguments to find a AccessControl
     * @example
     * // Get one AccessControl
     * const accessControl = await prisma.accessControl.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccessControlFindFirstArgs>(args?: SelectSubset<T, AccessControlFindFirstArgs<ExtArgs>>): Prisma__AccessControlClient<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccessControl that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessControlFindFirstOrThrowArgs} args - Arguments to find a AccessControl
     * @example
     * // Get one AccessControl
     * const accessControl = await prisma.accessControl.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccessControlFindFirstOrThrowArgs>(args?: SelectSubset<T, AccessControlFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccessControlClient<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AccessControls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessControlFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccessControls
     * const accessControls = await prisma.accessControl.findMany()
     * 
     * // Get first 10 AccessControls
     * const accessControls = await prisma.accessControl.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accessControlWithIdOnly = await prisma.accessControl.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccessControlFindManyArgs>(args?: SelectSubset<T, AccessControlFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AccessControl.
     * @param {AccessControlCreateArgs} args - Arguments to create a AccessControl.
     * @example
     * // Create one AccessControl
     * const AccessControl = await prisma.accessControl.create({
     *   data: {
     *     // ... data to create a AccessControl
     *   }
     * })
     * 
     */
    create<T extends AccessControlCreateArgs>(args: SelectSubset<T, AccessControlCreateArgs<ExtArgs>>): Prisma__AccessControlClient<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AccessControls.
     * @param {AccessControlCreateManyArgs} args - Arguments to create many AccessControls.
     * @example
     * // Create many AccessControls
     * const accessControl = await prisma.accessControl.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccessControlCreateManyArgs>(args?: SelectSubset<T, AccessControlCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AccessControls and returns the data saved in the database.
     * @param {AccessControlCreateManyAndReturnArgs} args - Arguments to create many AccessControls.
     * @example
     * // Create many AccessControls
     * const accessControl = await prisma.accessControl.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AccessControls and only return the `id`
     * const accessControlWithIdOnly = await prisma.accessControl.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccessControlCreateManyAndReturnArgs>(args?: SelectSubset<T, AccessControlCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AccessControl.
     * @param {AccessControlDeleteArgs} args - Arguments to delete one AccessControl.
     * @example
     * // Delete one AccessControl
     * const AccessControl = await prisma.accessControl.delete({
     *   where: {
     *     // ... filter to delete one AccessControl
     *   }
     * })
     * 
     */
    delete<T extends AccessControlDeleteArgs>(args: SelectSubset<T, AccessControlDeleteArgs<ExtArgs>>): Prisma__AccessControlClient<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AccessControl.
     * @param {AccessControlUpdateArgs} args - Arguments to update one AccessControl.
     * @example
     * // Update one AccessControl
     * const accessControl = await prisma.accessControl.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccessControlUpdateArgs>(args: SelectSubset<T, AccessControlUpdateArgs<ExtArgs>>): Prisma__AccessControlClient<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AccessControls.
     * @param {AccessControlDeleteManyArgs} args - Arguments to filter AccessControls to delete.
     * @example
     * // Delete a few AccessControls
     * const { count } = await prisma.accessControl.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccessControlDeleteManyArgs>(args?: SelectSubset<T, AccessControlDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccessControls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessControlUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccessControls
     * const accessControl = await prisma.accessControl.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccessControlUpdateManyArgs>(args: SelectSubset<T, AccessControlUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccessControls and returns the data updated in the database.
     * @param {AccessControlUpdateManyAndReturnArgs} args - Arguments to update many AccessControls.
     * @example
     * // Update many AccessControls
     * const accessControl = await prisma.accessControl.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AccessControls and only return the `id`
     * const accessControlWithIdOnly = await prisma.accessControl.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccessControlUpdateManyAndReturnArgs>(args: SelectSubset<T, AccessControlUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AccessControl.
     * @param {AccessControlUpsertArgs} args - Arguments to update or create a AccessControl.
     * @example
     * // Update or create a AccessControl
     * const accessControl = await prisma.accessControl.upsert({
     *   create: {
     *     // ... data to create a AccessControl
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccessControl we want to update
     *   }
     * })
     */
    upsert<T extends AccessControlUpsertArgs>(args: SelectSubset<T, AccessControlUpsertArgs<ExtArgs>>): Prisma__AccessControlClient<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AccessControls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessControlCountArgs} args - Arguments to filter AccessControls to count.
     * @example
     * // Count the number of AccessControls
     * const count = await prisma.accessControl.count({
     *   where: {
     *     // ... the filter for the AccessControls we want to count
     *   }
     * })
    **/
    count<T extends AccessControlCountArgs>(
      args?: Subset<T, AccessControlCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccessControlCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccessControl.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessControlAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccessControlAggregateArgs>(args: Subset<T, AccessControlAggregateArgs>): Prisma.PrismaPromise<GetAccessControlAggregateType<T>>

    /**
     * Group by AccessControl.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessControlGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccessControlGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccessControlGroupByArgs['orderBy'] }
        : { orderBy?: AccessControlGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccessControlGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccessControlGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccessControl model
   */
  readonly fields: AccessControlFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccessControl.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccessControlClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AccessControl$userArgs<ExtArgs> = {}>(args?: Subset<T, AccessControl$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    branch<T extends AccessControl$branchArgs<ExtArgs> = {}>(args?: Subset<T, AccessControl$branchArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AccessControl model
   */
  interface AccessControlFieldRefs {
    readonly id: FieldRef<"AccessControl", 'Int'>
    readonly user_uuid: FieldRef<"AccessControl", 'String'>
    readonly branch_uuid: FieldRef<"AccessControl", 'String'>
    readonly access: FieldRef<"AccessControl", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AccessControl findUnique
   */
  export type AccessControlFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    /**
     * Filter, which AccessControl to fetch.
     */
    where: AccessControlWhereUniqueInput
  }

  /**
   * AccessControl findUniqueOrThrow
   */
  export type AccessControlFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    /**
     * Filter, which AccessControl to fetch.
     */
    where: AccessControlWhereUniqueInput
  }

  /**
   * AccessControl findFirst
   */
  export type AccessControlFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    /**
     * Filter, which AccessControl to fetch.
     */
    where?: AccessControlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessControls to fetch.
     */
    orderBy?: AccessControlOrderByWithRelationInput | AccessControlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessControls.
     */
    cursor?: AccessControlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessControls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessControls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessControls.
     */
    distinct?: AccessControlScalarFieldEnum | AccessControlScalarFieldEnum[]
  }

  /**
   * AccessControl findFirstOrThrow
   */
  export type AccessControlFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    /**
     * Filter, which AccessControl to fetch.
     */
    where?: AccessControlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessControls to fetch.
     */
    orderBy?: AccessControlOrderByWithRelationInput | AccessControlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessControls.
     */
    cursor?: AccessControlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessControls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessControls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessControls.
     */
    distinct?: AccessControlScalarFieldEnum | AccessControlScalarFieldEnum[]
  }

  /**
   * AccessControl findMany
   */
  export type AccessControlFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    /**
     * Filter, which AccessControls to fetch.
     */
    where?: AccessControlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessControls to fetch.
     */
    orderBy?: AccessControlOrderByWithRelationInput | AccessControlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccessControls.
     */
    cursor?: AccessControlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessControls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessControls.
     */
    skip?: number
    distinct?: AccessControlScalarFieldEnum | AccessControlScalarFieldEnum[]
  }

  /**
   * AccessControl create
   */
  export type AccessControlCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    /**
     * The data needed to create a AccessControl.
     */
    data: XOR<AccessControlCreateInput, AccessControlUncheckedCreateInput>
  }

  /**
   * AccessControl createMany
   */
  export type AccessControlCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccessControls.
     */
    data: AccessControlCreateManyInput | AccessControlCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccessControl createManyAndReturn
   */
  export type AccessControlCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * The data used to create many AccessControls.
     */
    data: AccessControlCreateManyInput | AccessControlCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccessControl update
   */
  export type AccessControlUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    /**
     * The data needed to update a AccessControl.
     */
    data: XOR<AccessControlUpdateInput, AccessControlUncheckedUpdateInput>
    /**
     * Choose, which AccessControl to update.
     */
    where: AccessControlWhereUniqueInput
  }

  /**
   * AccessControl updateMany
   */
  export type AccessControlUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccessControls.
     */
    data: XOR<AccessControlUpdateManyMutationInput, AccessControlUncheckedUpdateManyInput>
    /**
     * Filter which AccessControls to update
     */
    where?: AccessControlWhereInput
    /**
     * Limit how many AccessControls to update.
     */
    limit?: number
  }

  /**
   * AccessControl updateManyAndReturn
   */
  export type AccessControlUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * The data used to update AccessControls.
     */
    data: XOR<AccessControlUpdateManyMutationInput, AccessControlUncheckedUpdateManyInput>
    /**
     * Filter which AccessControls to update
     */
    where?: AccessControlWhereInput
    /**
     * Limit how many AccessControls to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccessControl upsert
   */
  export type AccessControlUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    /**
     * The filter to search for the AccessControl to update in case it exists.
     */
    where: AccessControlWhereUniqueInput
    /**
     * In case the AccessControl found by the `where` argument doesn't exist, create a new AccessControl with this data.
     */
    create: XOR<AccessControlCreateInput, AccessControlUncheckedCreateInput>
    /**
     * In case the AccessControl was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccessControlUpdateInput, AccessControlUncheckedUpdateInput>
  }

  /**
   * AccessControl delete
   */
  export type AccessControlDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    /**
     * Filter which AccessControl to delete.
     */
    where: AccessControlWhereUniqueInput
  }

  /**
   * AccessControl deleteMany
   */
  export type AccessControlDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessControls to delete
     */
    where?: AccessControlWhereInput
    /**
     * Limit how many AccessControls to delete.
     */
    limit?: number
  }

  /**
   * AccessControl.user
   */
  export type AccessControl$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AccessControl.branch
   */
  export type AccessControl$branchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    where?: BranchWhereInput
  }

  /**
   * AccessControl without action
   */
  export type AccessControlDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
  }


  /**
   * Model School
   */

  export type AggregateSchool = {
    _count: SchoolCountAggregateOutputType | null
    _avg: SchoolAvgAggregateOutputType | null
    _sum: SchoolSumAggregateOutputType | null
    _min: SchoolMinAggregateOutputType | null
    _max: SchoolMaxAggregateOutputType | null
  }

  export type SchoolAvgAggregateOutputType = {
    id: number | null
  }

  export type SchoolSumAggregateOutputType = {
    id: number | null
  }

  export type SchoolMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    token: string | null
    email: string | null
    slug: string | null
    name: string | null
    contact: string | null
    avatar: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    zip: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SchoolMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    token: string | null
    email: string | null
    slug: string | null
    name: string | null
    contact: string | null
    avatar: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    zip: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SchoolCountAggregateOutputType = {
    id: number
    uuid: number
    token: number
    email: number
    slug: number
    name: number
    contact: number
    avatar: number
    address: number
    city: number
    state: number
    country: number
    zip: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type SchoolAvgAggregateInputType = {
    id?: true
  }

  export type SchoolSumAggregateInputType = {
    id?: true
  }

  export type SchoolMinAggregateInputType = {
    id?: true
    uuid?: true
    token?: true
    email?: true
    slug?: true
    name?: true
    contact?: true
    avatar?: true
    address?: true
    city?: true
    state?: true
    country?: true
    zip?: true
    created_at?: true
    updated_at?: true
  }

  export type SchoolMaxAggregateInputType = {
    id?: true
    uuid?: true
    token?: true
    email?: true
    slug?: true
    name?: true
    contact?: true
    avatar?: true
    address?: true
    city?: true
    state?: true
    country?: true
    zip?: true
    created_at?: true
    updated_at?: true
  }

  export type SchoolCountAggregateInputType = {
    id?: true
    uuid?: true
    token?: true
    email?: true
    slug?: true
    name?: true
    contact?: true
    avatar?: true
    address?: true
    city?: true
    state?: true
    country?: true
    zip?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type SchoolAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which School to aggregate.
     */
    where?: SchoolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schools to fetch.
     */
    orderBy?: SchoolOrderByWithRelationInput | SchoolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SchoolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schools from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schools.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Schools
    **/
    _count?: true | SchoolCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SchoolAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SchoolSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SchoolMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SchoolMaxAggregateInputType
  }

  export type GetSchoolAggregateType<T extends SchoolAggregateArgs> = {
        [P in keyof T & keyof AggregateSchool]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSchool[P]>
      : GetScalarType<T[P], AggregateSchool[P]>
  }




  export type SchoolGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SchoolWhereInput
    orderBy?: SchoolOrderByWithAggregationInput | SchoolOrderByWithAggregationInput[]
    by: SchoolScalarFieldEnum[] | SchoolScalarFieldEnum
    having?: SchoolScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SchoolCountAggregateInputType | true
    _avg?: SchoolAvgAggregateInputType
    _sum?: SchoolSumAggregateInputType
    _min?: SchoolMinAggregateInputType
    _max?: SchoolMaxAggregateInputType
  }

  export type SchoolGroupByOutputType = {
    id: number
    uuid: string
    token: string
    email: string
    slug: string
    name: string
    contact: string | null
    avatar: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    zip: string | null
    created_at: Date
    updated_at: Date
    _count: SchoolCountAggregateOutputType | null
    _avg: SchoolAvgAggregateOutputType | null
    _sum: SchoolSumAggregateOutputType | null
    _min: SchoolMinAggregateOutputType | null
    _max: SchoolMaxAggregateOutputType | null
  }

  type GetSchoolGroupByPayload<T extends SchoolGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SchoolGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SchoolGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SchoolGroupByOutputType[P]>
            : GetScalarType<T[P], SchoolGroupByOutputType[P]>
        }
      >
    >


  export type SchoolSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    token?: boolean
    email?: boolean
    slug?: boolean
    name?: boolean
    contact?: boolean
    avatar?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    zip?: boolean
    created_at?: boolean
    updated_at?: boolean
    users?: boolean | School$usersArgs<ExtArgs>
    branches?: boolean | School$branchesArgs<ExtArgs>
    access?: boolean | School$accessArgs<ExtArgs>
    _count?: boolean | SchoolCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["school"]>

  export type SchoolSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    token?: boolean
    email?: boolean
    slug?: boolean
    name?: boolean
    contact?: boolean
    avatar?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    zip?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["school"]>

  export type SchoolSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    token?: boolean
    email?: boolean
    slug?: boolean
    name?: boolean
    contact?: boolean
    avatar?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    zip?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["school"]>

  export type SchoolSelectScalar = {
    id?: boolean
    uuid?: boolean
    token?: boolean
    email?: boolean
    slug?: boolean
    name?: boolean
    contact?: boolean
    avatar?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    zip?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type SchoolOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "token" | "email" | "slug" | "name" | "contact" | "avatar" | "address" | "city" | "state" | "country" | "zip" | "created_at" | "updated_at", ExtArgs["result"]["school"]>
  export type SchoolInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | School$usersArgs<ExtArgs>
    branches?: boolean | School$branchesArgs<ExtArgs>
    access?: boolean | School$accessArgs<ExtArgs>
    _count?: boolean | SchoolCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SchoolIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SchoolIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SchoolPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "School"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      branches: Prisma.$BranchPayload<ExtArgs>[]
      access: Prisma.$BranchAccessPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      token: string
      email: string
      slug: string
      name: string
      contact: string | null
      avatar: string | null
      address: string | null
      city: string | null
      state: string | null
      country: string | null
      zip: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["school"]>
    composites: {}
  }

  type SchoolGetPayload<S extends boolean | null | undefined | SchoolDefaultArgs> = $Result.GetResult<Prisma.$SchoolPayload, S>

  type SchoolCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SchoolFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SchoolCountAggregateInputType | true
    }

  export interface SchoolDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['School'], meta: { name: 'School' } }
    /**
     * Find zero or one School that matches the filter.
     * @param {SchoolFindUniqueArgs} args - Arguments to find a School
     * @example
     * // Get one School
     * const school = await prisma.school.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SchoolFindUniqueArgs>(args: SelectSubset<T, SchoolFindUniqueArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one School that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SchoolFindUniqueOrThrowArgs} args - Arguments to find a School
     * @example
     * // Get one School
     * const school = await prisma.school.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SchoolFindUniqueOrThrowArgs>(args: SelectSubset<T, SchoolFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first School that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolFindFirstArgs} args - Arguments to find a School
     * @example
     * // Get one School
     * const school = await prisma.school.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SchoolFindFirstArgs>(args?: SelectSubset<T, SchoolFindFirstArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first School that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolFindFirstOrThrowArgs} args - Arguments to find a School
     * @example
     * // Get one School
     * const school = await prisma.school.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SchoolFindFirstOrThrowArgs>(args?: SelectSubset<T, SchoolFindFirstOrThrowArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Schools that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Schools
     * const schools = await prisma.school.findMany()
     * 
     * // Get first 10 Schools
     * const schools = await prisma.school.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const schoolWithIdOnly = await prisma.school.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SchoolFindManyArgs>(args?: SelectSubset<T, SchoolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a School.
     * @param {SchoolCreateArgs} args - Arguments to create a School.
     * @example
     * // Create one School
     * const School = await prisma.school.create({
     *   data: {
     *     // ... data to create a School
     *   }
     * })
     * 
     */
    create<T extends SchoolCreateArgs>(args: SelectSubset<T, SchoolCreateArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Schools.
     * @param {SchoolCreateManyArgs} args - Arguments to create many Schools.
     * @example
     * // Create many Schools
     * const school = await prisma.school.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SchoolCreateManyArgs>(args?: SelectSubset<T, SchoolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Schools and returns the data saved in the database.
     * @param {SchoolCreateManyAndReturnArgs} args - Arguments to create many Schools.
     * @example
     * // Create many Schools
     * const school = await prisma.school.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Schools and only return the `id`
     * const schoolWithIdOnly = await prisma.school.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SchoolCreateManyAndReturnArgs>(args?: SelectSubset<T, SchoolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a School.
     * @param {SchoolDeleteArgs} args - Arguments to delete one School.
     * @example
     * // Delete one School
     * const School = await prisma.school.delete({
     *   where: {
     *     // ... filter to delete one School
     *   }
     * })
     * 
     */
    delete<T extends SchoolDeleteArgs>(args: SelectSubset<T, SchoolDeleteArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one School.
     * @param {SchoolUpdateArgs} args - Arguments to update one School.
     * @example
     * // Update one School
     * const school = await prisma.school.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SchoolUpdateArgs>(args: SelectSubset<T, SchoolUpdateArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Schools.
     * @param {SchoolDeleteManyArgs} args - Arguments to filter Schools to delete.
     * @example
     * // Delete a few Schools
     * const { count } = await prisma.school.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SchoolDeleteManyArgs>(args?: SelectSubset<T, SchoolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Schools.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Schools
     * const school = await prisma.school.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SchoolUpdateManyArgs>(args: SelectSubset<T, SchoolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Schools and returns the data updated in the database.
     * @param {SchoolUpdateManyAndReturnArgs} args - Arguments to update many Schools.
     * @example
     * // Update many Schools
     * const school = await prisma.school.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Schools and only return the `id`
     * const schoolWithIdOnly = await prisma.school.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SchoolUpdateManyAndReturnArgs>(args: SelectSubset<T, SchoolUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one School.
     * @param {SchoolUpsertArgs} args - Arguments to update or create a School.
     * @example
     * // Update or create a School
     * const school = await prisma.school.upsert({
     *   create: {
     *     // ... data to create a School
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the School we want to update
     *   }
     * })
     */
    upsert<T extends SchoolUpsertArgs>(args: SelectSubset<T, SchoolUpsertArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Schools.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolCountArgs} args - Arguments to filter Schools to count.
     * @example
     * // Count the number of Schools
     * const count = await prisma.school.count({
     *   where: {
     *     // ... the filter for the Schools we want to count
     *   }
     * })
    **/
    count<T extends SchoolCountArgs>(
      args?: Subset<T, SchoolCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SchoolCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a School.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SchoolAggregateArgs>(args: Subset<T, SchoolAggregateArgs>): Prisma.PrismaPromise<GetSchoolAggregateType<T>>

    /**
     * Group by School.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SchoolGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SchoolGroupByArgs['orderBy'] }
        : { orderBy?: SchoolGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SchoolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSchoolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the School model
   */
  readonly fields: SchoolFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for School.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SchoolClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends School$usersArgs<ExtArgs> = {}>(args?: Subset<T, School$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    branches<T extends School$branchesArgs<ExtArgs> = {}>(args?: Subset<T, School$branchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    access<T extends School$accessArgs<ExtArgs> = {}>(args?: Subset<T, School$accessArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the School model
   */
  interface SchoolFieldRefs {
    readonly id: FieldRef<"School", 'Int'>
    readonly uuid: FieldRef<"School", 'String'>
    readonly token: FieldRef<"School", 'String'>
    readonly email: FieldRef<"School", 'String'>
    readonly slug: FieldRef<"School", 'String'>
    readonly name: FieldRef<"School", 'String'>
    readonly contact: FieldRef<"School", 'String'>
    readonly avatar: FieldRef<"School", 'String'>
    readonly address: FieldRef<"School", 'String'>
    readonly city: FieldRef<"School", 'String'>
    readonly state: FieldRef<"School", 'String'>
    readonly country: FieldRef<"School", 'String'>
    readonly zip: FieldRef<"School", 'String'>
    readonly created_at: FieldRef<"School", 'DateTime'>
    readonly updated_at: FieldRef<"School", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * School findUnique
   */
  export type SchoolFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    /**
     * Filter, which School to fetch.
     */
    where: SchoolWhereUniqueInput
  }

  /**
   * School findUniqueOrThrow
   */
  export type SchoolFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    /**
     * Filter, which School to fetch.
     */
    where: SchoolWhereUniqueInput
  }

  /**
   * School findFirst
   */
  export type SchoolFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    /**
     * Filter, which School to fetch.
     */
    where?: SchoolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schools to fetch.
     */
    orderBy?: SchoolOrderByWithRelationInput | SchoolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schools.
     */
    cursor?: SchoolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schools from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schools.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schools.
     */
    distinct?: SchoolScalarFieldEnum | SchoolScalarFieldEnum[]
  }

  /**
   * School findFirstOrThrow
   */
  export type SchoolFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    /**
     * Filter, which School to fetch.
     */
    where?: SchoolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schools to fetch.
     */
    orderBy?: SchoolOrderByWithRelationInput | SchoolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schools.
     */
    cursor?: SchoolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schools from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schools.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schools.
     */
    distinct?: SchoolScalarFieldEnum | SchoolScalarFieldEnum[]
  }

  /**
   * School findMany
   */
  export type SchoolFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    /**
     * Filter, which Schools to fetch.
     */
    where?: SchoolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schools to fetch.
     */
    orderBy?: SchoolOrderByWithRelationInput | SchoolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Schools.
     */
    cursor?: SchoolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schools from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schools.
     */
    skip?: number
    distinct?: SchoolScalarFieldEnum | SchoolScalarFieldEnum[]
  }

  /**
   * School create
   */
  export type SchoolCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    /**
     * The data needed to create a School.
     */
    data: XOR<SchoolCreateInput, SchoolUncheckedCreateInput>
  }

  /**
   * School createMany
   */
  export type SchoolCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Schools.
     */
    data: SchoolCreateManyInput | SchoolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * School createManyAndReturn
   */
  export type SchoolCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * The data used to create many Schools.
     */
    data: SchoolCreateManyInput | SchoolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * School update
   */
  export type SchoolUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    /**
     * The data needed to update a School.
     */
    data: XOR<SchoolUpdateInput, SchoolUncheckedUpdateInput>
    /**
     * Choose, which School to update.
     */
    where: SchoolWhereUniqueInput
  }

  /**
   * School updateMany
   */
  export type SchoolUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Schools.
     */
    data: XOR<SchoolUpdateManyMutationInput, SchoolUncheckedUpdateManyInput>
    /**
     * Filter which Schools to update
     */
    where?: SchoolWhereInput
    /**
     * Limit how many Schools to update.
     */
    limit?: number
  }

  /**
   * School updateManyAndReturn
   */
  export type SchoolUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * The data used to update Schools.
     */
    data: XOR<SchoolUpdateManyMutationInput, SchoolUncheckedUpdateManyInput>
    /**
     * Filter which Schools to update
     */
    where?: SchoolWhereInput
    /**
     * Limit how many Schools to update.
     */
    limit?: number
  }

  /**
   * School upsert
   */
  export type SchoolUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    /**
     * The filter to search for the School to update in case it exists.
     */
    where: SchoolWhereUniqueInput
    /**
     * In case the School found by the `where` argument doesn't exist, create a new School with this data.
     */
    create: XOR<SchoolCreateInput, SchoolUncheckedCreateInput>
    /**
     * In case the School was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SchoolUpdateInput, SchoolUncheckedUpdateInput>
  }

  /**
   * School delete
   */
  export type SchoolDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    /**
     * Filter which School to delete.
     */
    where: SchoolWhereUniqueInput
  }

  /**
   * School deleteMany
   */
  export type SchoolDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Schools to delete
     */
    where?: SchoolWhereInput
    /**
     * Limit how many Schools to delete.
     */
    limit?: number
  }

  /**
   * School.users
   */
  export type School$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * School.branches
   */
  export type School$branchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    where?: BranchWhereInput
    orderBy?: BranchOrderByWithRelationInput | BranchOrderByWithRelationInput[]
    cursor?: BranchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BranchScalarFieldEnum | BranchScalarFieldEnum[]
  }

  /**
   * School.access
   */
  export type School$accessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    where?: BranchAccessWhereInput
    orderBy?: BranchAccessOrderByWithRelationInput | BranchAccessOrderByWithRelationInput[]
    cursor?: BranchAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BranchAccessScalarFieldEnum | BranchAccessScalarFieldEnum[]
  }

  /**
   * School without action
   */
  export type SchoolDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
  }


  /**
   * Model Branch
   */

  export type AggregateBranch = {
    _count: BranchCountAggregateOutputType | null
    _avg: BranchAvgAggregateOutputType | null
    _sum: BranchSumAggregateOutputType | null
    _min: BranchMinAggregateOutputType | null
    _max: BranchMaxAggregateOutputType | null
  }

  export type BranchAvgAggregateOutputType = {
    id: number | null
  }

  export type BranchSumAggregateOutputType = {
    id: number | null
  }

  export type BranchMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    school_uuid: string | null
    name: string | null
    email: string | null
    contact: string | null
    avatar: string | null
    address: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type BranchMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    school_uuid: string | null
    name: string | null
    email: string | null
    contact: string | null
    avatar: string | null
    address: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type BranchCountAggregateOutputType = {
    id: number
    uuid: number
    school_uuid: number
    name: number
    email: number
    contact: number
    avatar: number
    address: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type BranchAvgAggregateInputType = {
    id?: true
  }

  export type BranchSumAggregateInputType = {
    id?: true
  }

  export type BranchMinAggregateInputType = {
    id?: true
    uuid?: true
    school_uuid?: true
    name?: true
    email?: true
    contact?: true
    avatar?: true
    address?: true
    created_at?: true
    updated_at?: true
  }

  export type BranchMaxAggregateInputType = {
    id?: true
    uuid?: true
    school_uuid?: true
    name?: true
    email?: true
    contact?: true
    avatar?: true
    address?: true
    created_at?: true
    updated_at?: true
  }

  export type BranchCountAggregateInputType = {
    id?: true
    uuid?: true
    school_uuid?: true
    name?: true
    email?: true
    contact?: true
    avatar?: true
    address?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type BranchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Branch to aggregate.
     */
    where?: BranchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Branches to fetch.
     */
    orderBy?: BranchOrderByWithRelationInput | BranchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BranchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Branches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Branches
    **/
    _count?: true | BranchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BranchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BranchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BranchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BranchMaxAggregateInputType
  }

  export type GetBranchAggregateType<T extends BranchAggregateArgs> = {
        [P in keyof T & keyof AggregateBranch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBranch[P]>
      : GetScalarType<T[P], AggregateBranch[P]>
  }




  export type BranchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BranchWhereInput
    orderBy?: BranchOrderByWithAggregationInput | BranchOrderByWithAggregationInput[]
    by: BranchScalarFieldEnum[] | BranchScalarFieldEnum
    having?: BranchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BranchCountAggregateInputType | true
    _avg?: BranchAvgAggregateInputType
    _sum?: BranchSumAggregateInputType
    _min?: BranchMinAggregateInputType
    _max?: BranchMaxAggregateInputType
  }

  export type BranchGroupByOutputType = {
    id: number
    uuid: string
    school_uuid: string
    name: string
    email: string | null
    contact: string | null
    avatar: string | null
    address: string | null
    created_at: Date
    updated_at: Date
    _count: BranchCountAggregateOutputType | null
    _avg: BranchAvgAggregateOutputType | null
    _sum: BranchSumAggregateOutputType | null
    _min: BranchMinAggregateOutputType | null
    _max: BranchMaxAggregateOutputType | null
  }

  type GetBranchGroupByPayload<T extends BranchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BranchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BranchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BranchGroupByOutputType[P]>
            : GetScalarType<T[P], BranchGroupByOutputType[P]>
        }
      >
    >


  export type BranchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    school_uuid?: boolean
    name?: boolean
    email?: boolean
    contact?: boolean
    avatar?: boolean
    address?: boolean
    created_at?: boolean
    updated_at?: boolean
    grades?: boolean | Branch$gradesArgs<ExtArgs>
    classes?: boolean | Branch$classesArgs<ExtArgs>
    students?: boolean | Branch$studentsArgs<ExtArgs>
    control?: boolean | Branch$controlArgs<ExtArgs>
    access?: boolean | Branch$accessArgs<ExtArgs>
    school?: boolean | SchoolDefaultArgs<ExtArgs>
    _count?: boolean | BranchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["branch"]>

  export type BranchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    school_uuid?: boolean
    name?: boolean
    email?: boolean
    contact?: boolean
    avatar?: boolean
    address?: boolean
    created_at?: boolean
    updated_at?: boolean
    school?: boolean | SchoolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["branch"]>

  export type BranchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    school_uuid?: boolean
    name?: boolean
    email?: boolean
    contact?: boolean
    avatar?: boolean
    address?: boolean
    created_at?: boolean
    updated_at?: boolean
    school?: boolean | SchoolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["branch"]>

  export type BranchSelectScalar = {
    id?: boolean
    uuid?: boolean
    school_uuid?: boolean
    name?: boolean
    email?: boolean
    contact?: boolean
    avatar?: boolean
    address?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type BranchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "school_uuid" | "name" | "email" | "contact" | "avatar" | "address" | "created_at" | "updated_at", ExtArgs["result"]["branch"]>
  export type BranchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    grades?: boolean | Branch$gradesArgs<ExtArgs>
    classes?: boolean | Branch$classesArgs<ExtArgs>
    students?: boolean | Branch$studentsArgs<ExtArgs>
    control?: boolean | Branch$controlArgs<ExtArgs>
    access?: boolean | Branch$accessArgs<ExtArgs>
    school?: boolean | SchoolDefaultArgs<ExtArgs>
    _count?: boolean | BranchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BranchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    school?: boolean | SchoolDefaultArgs<ExtArgs>
  }
  export type BranchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    school?: boolean | SchoolDefaultArgs<ExtArgs>
  }

  export type $BranchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Branch"
    objects: {
      grades: Prisma.$GradePayload<ExtArgs>[]
      classes: Prisma.$ClassPayload<ExtArgs>[]
      students: Prisma.$StudentPayload<ExtArgs>[]
      control: Prisma.$AccessControlPayload<ExtArgs>[]
      access: Prisma.$BranchAccessPayload<ExtArgs>[]
      school: Prisma.$SchoolPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      school_uuid: string
      name: string
      email: string | null
      contact: string | null
      avatar: string | null
      address: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["branch"]>
    composites: {}
  }

  type BranchGetPayload<S extends boolean | null | undefined | BranchDefaultArgs> = $Result.GetResult<Prisma.$BranchPayload, S>

  type BranchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BranchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BranchCountAggregateInputType | true
    }

  export interface BranchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Branch'], meta: { name: 'Branch' } }
    /**
     * Find zero or one Branch that matches the filter.
     * @param {BranchFindUniqueArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BranchFindUniqueArgs>(args: SelectSubset<T, BranchFindUniqueArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Branch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BranchFindUniqueOrThrowArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BranchFindUniqueOrThrowArgs>(args: SelectSubset<T, BranchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Branch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchFindFirstArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BranchFindFirstArgs>(args?: SelectSubset<T, BranchFindFirstArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Branch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchFindFirstOrThrowArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BranchFindFirstOrThrowArgs>(args?: SelectSubset<T, BranchFindFirstOrThrowArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Branches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Branches
     * const branches = await prisma.branch.findMany()
     * 
     * // Get first 10 Branches
     * const branches = await prisma.branch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const branchWithIdOnly = await prisma.branch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BranchFindManyArgs>(args?: SelectSubset<T, BranchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Branch.
     * @param {BranchCreateArgs} args - Arguments to create a Branch.
     * @example
     * // Create one Branch
     * const Branch = await prisma.branch.create({
     *   data: {
     *     // ... data to create a Branch
     *   }
     * })
     * 
     */
    create<T extends BranchCreateArgs>(args: SelectSubset<T, BranchCreateArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Branches.
     * @param {BranchCreateManyArgs} args - Arguments to create many Branches.
     * @example
     * // Create many Branches
     * const branch = await prisma.branch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BranchCreateManyArgs>(args?: SelectSubset<T, BranchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Branches and returns the data saved in the database.
     * @param {BranchCreateManyAndReturnArgs} args - Arguments to create many Branches.
     * @example
     * // Create many Branches
     * const branch = await prisma.branch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Branches and only return the `id`
     * const branchWithIdOnly = await prisma.branch.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BranchCreateManyAndReturnArgs>(args?: SelectSubset<T, BranchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Branch.
     * @param {BranchDeleteArgs} args - Arguments to delete one Branch.
     * @example
     * // Delete one Branch
     * const Branch = await prisma.branch.delete({
     *   where: {
     *     // ... filter to delete one Branch
     *   }
     * })
     * 
     */
    delete<T extends BranchDeleteArgs>(args: SelectSubset<T, BranchDeleteArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Branch.
     * @param {BranchUpdateArgs} args - Arguments to update one Branch.
     * @example
     * // Update one Branch
     * const branch = await prisma.branch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BranchUpdateArgs>(args: SelectSubset<T, BranchUpdateArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Branches.
     * @param {BranchDeleteManyArgs} args - Arguments to filter Branches to delete.
     * @example
     * // Delete a few Branches
     * const { count } = await prisma.branch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BranchDeleteManyArgs>(args?: SelectSubset<T, BranchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Branches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Branches
     * const branch = await prisma.branch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BranchUpdateManyArgs>(args: SelectSubset<T, BranchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Branches and returns the data updated in the database.
     * @param {BranchUpdateManyAndReturnArgs} args - Arguments to update many Branches.
     * @example
     * // Update many Branches
     * const branch = await prisma.branch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Branches and only return the `id`
     * const branchWithIdOnly = await prisma.branch.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BranchUpdateManyAndReturnArgs>(args: SelectSubset<T, BranchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Branch.
     * @param {BranchUpsertArgs} args - Arguments to update or create a Branch.
     * @example
     * // Update or create a Branch
     * const branch = await prisma.branch.upsert({
     *   create: {
     *     // ... data to create a Branch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Branch we want to update
     *   }
     * })
     */
    upsert<T extends BranchUpsertArgs>(args: SelectSubset<T, BranchUpsertArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Branches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchCountArgs} args - Arguments to filter Branches to count.
     * @example
     * // Count the number of Branches
     * const count = await prisma.branch.count({
     *   where: {
     *     // ... the filter for the Branches we want to count
     *   }
     * })
    **/
    count<T extends BranchCountArgs>(
      args?: Subset<T, BranchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BranchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Branch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BranchAggregateArgs>(args: Subset<T, BranchAggregateArgs>): Prisma.PrismaPromise<GetBranchAggregateType<T>>

    /**
     * Group by Branch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BranchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BranchGroupByArgs['orderBy'] }
        : { orderBy?: BranchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BranchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBranchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Branch model
   */
  readonly fields: BranchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Branch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BranchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    grades<T extends Branch$gradesArgs<ExtArgs> = {}>(args?: Subset<T, Branch$gradesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    classes<T extends Branch$classesArgs<ExtArgs> = {}>(args?: Subset<T, Branch$classesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    students<T extends Branch$studentsArgs<ExtArgs> = {}>(args?: Subset<T, Branch$studentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    control<T extends Branch$controlArgs<ExtArgs> = {}>(args?: Subset<T, Branch$controlArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessControlPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    access<T extends Branch$accessArgs<ExtArgs> = {}>(args?: Subset<T, Branch$accessArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    school<T extends SchoolDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SchoolDefaultArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Branch model
   */
  interface BranchFieldRefs {
    readonly id: FieldRef<"Branch", 'Int'>
    readonly uuid: FieldRef<"Branch", 'String'>
    readonly school_uuid: FieldRef<"Branch", 'String'>
    readonly name: FieldRef<"Branch", 'String'>
    readonly email: FieldRef<"Branch", 'String'>
    readonly contact: FieldRef<"Branch", 'String'>
    readonly avatar: FieldRef<"Branch", 'String'>
    readonly address: FieldRef<"Branch", 'String'>
    readonly created_at: FieldRef<"Branch", 'DateTime'>
    readonly updated_at: FieldRef<"Branch", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Branch findUnique
   */
  export type BranchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branch to fetch.
     */
    where: BranchWhereUniqueInput
  }

  /**
   * Branch findUniqueOrThrow
   */
  export type BranchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branch to fetch.
     */
    where: BranchWhereUniqueInput
  }

  /**
   * Branch findFirst
   */
  export type BranchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branch to fetch.
     */
    where?: BranchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Branches to fetch.
     */
    orderBy?: BranchOrderByWithRelationInput | BranchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Branches.
     */
    cursor?: BranchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Branches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Branches.
     */
    distinct?: BranchScalarFieldEnum | BranchScalarFieldEnum[]
  }

  /**
   * Branch findFirstOrThrow
   */
  export type BranchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branch to fetch.
     */
    where?: BranchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Branches to fetch.
     */
    orderBy?: BranchOrderByWithRelationInput | BranchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Branches.
     */
    cursor?: BranchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Branches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Branches.
     */
    distinct?: BranchScalarFieldEnum | BranchScalarFieldEnum[]
  }

  /**
   * Branch findMany
   */
  export type BranchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branches to fetch.
     */
    where?: BranchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Branches to fetch.
     */
    orderBy?: BranchOrderByWithRelationInput | BranchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Branches.
     */
    cursor?: BranchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Branches.
     */
    skip?: number
    distinct?: BranchScalarFieldEnum | BranchScalarFieldEnum[]
  }

  /**
   * Branch create
   */
  export type BranchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * The data needed to create a Branch.
     */
    data: XOR<BranchCreateInput, BranchUncheckedCreateInput>
  }

  /**
   * Branch createMany
   */
  export type BranchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Branches.
     */
    data: BranchCreateManyInput | BranchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Branch createManyAndReturn
   */
  export type BranchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * The data used to create many Branches.
     */
    data: BranchCreateManyInput | BranchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Branch update
   */
  export type BranchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * The data needed to update a Branch.
     */
    data: XOR<BranchUpdateInput, BranchUncheckedUpdateInput>
    /**
     * Choose, which Branch to update.
     */
    where: BranchWhereUniqueInput
  }

  /**
   * Branch updateMany
   */
  export type BranchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Branches.
     */
    data: XOR<BranchUpdateManyMutationInput, BranchUncheckedUpdateManyInput>
    /**
     * Filter which Branches to update
     */
    where?: BranchWhereInput
    /**
     * Limit how many Branches to update.
     */
    limit?: number
  }

  /**
   * Branch updateManyAndReturn
   */
  export type BranchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * The data used to update Branches.
     */
    data: XOR<BranchUpdateManyMutationInput, BranchUncheckedUpdateManyInput>
    /**
     * Filter which Branches to update
     */
    where?: BranchWhereInput
    /**
     * Limit how many Branches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Branch upsert
   */
  export type BranchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * The filter to search for the Branch to update in case it exists.
     */
    where: BranchWhereUniqueInput
    /**
     * In case the Branch found by the `where` argument doesn't exist, create a new Branch with this data.
     */
    create: XOR<BranchCreateInput, BranchUncheckedCreateInput>
    /**
     * In case the Branch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BranchUpdateInput, BranchUncheckedUpdateInput>
  }

  /**
   * Branch delete
   */
  export type BranchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter which Branch to delete.
     */
    where: BranchWhereUniqueInput
  }

  /**
   * Branch deleteMany
   */
  export type BranchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Branches to delete
     */
    where?: BranchWhereInput
    /**
     * Limit how many Branches to delete.
     */
    limit?: number
  }

  /**
   * Branch.grades
   */
  export type Branch$gradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    where?: GradeWhereInput
    orderBy?: GradeOrderByWithRelationInput | GradeOrderByWithRelationInput[]
    cursor?: GradeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GradeScalarFieldEnum | GradeScalarFieldEnum[]
  }

  /**
   * Branch.classes
   */
  export type Branch$classesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    where?: ClassWhereInput
    orderBy?: ClassOrderByWithRelationInput | ClassOrderByWithRelationInput[]
    cursor?: ClassWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClassScalarFieldEnum | ClassScalarFieldEnum[]
  }

  /**
   * Branch.students
   */
  export type Branch$studentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    cursor?: StudentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Branch.control
   */
  export type Branch$controlArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessControl
     */
    select?: AccessControlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessControl
     */
    omit?: AccessControlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessControlInclude<ExtArgs> | null
    where?: AccessControlWhereInput
    orderBy?: AccessControlOrderByWithRelationInput | AccessControlOrderByWithRelationInput[]
    cursor?: AccessControlWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccessControlScalarFieldEnum | AccessControlScalarFieldEnum[]
  }

  /**
   * Branch.access
   */
  export type Branch$accessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    where?: BranchAccessWhereInput
    orderBy?: BranchAccessOrderByWithRelationInput | BranchAccessOrderByWithRelationInput[]
    cursor?: BranchAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BranchAccessScalarFieldEnum | BranchAccessScalarFieldEnum[]
  }

  /**
   * Branch without action
   */
  export type BranchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
  }


  /**
   * Model BranchAccess
   */

  export type AggregateBranchAccess = {
    _count: BranchAccessCountAggregateOutputType | null
    _avg: BranchAccessAvgAggregateOutputType | null
    _sum: BranchAccessSumAggregateOutputType | null
    _min: BranchAccessMinAggregateOutputType | null
    _max: BranchAccessMaxAggregateOutputType | null
  }

  export type BranchAccessAvgAggregateOutputType = {
    id: number | null
  }

  export type BranchAccessSumAggregateOutputType = {
    id: number | null
  }

  export type BranchAccessMinAggregateOutputType = {
    id: number | null
    role: $Enums.Role | null
    user_uuid: string | null
    school_uuid: string | null
    branch_uuid: string | null
  }

  export type BranchAccessMaxAggregateOutputType = {
    id: number | null
    role: $Enums.Role | null
    user_uuid: string | null
    school_uuid: string | null
    branch_uuid: string | null
  }

  export type BranchAccessCountAggregateOutputType = {
    id: number
    role: number
    user_uuid: number
    school_uuid: number
    branch_uuid: number
    _all: number
  }


  export type BranchAccessAvgAggregateInputType = {
    id?: true
  }

  export type BranchAccessSumAggregateInputType = {
    id?: true
  }

  export type BranchAccessMinAggregateInputType = {
    id?: true
    role?: true
    user_uuid?: true
    school_uuid?: true
    branch_uuid?: true
  }

  export type BranchAccessMaxAggregateInputType = {
    id?: true
    role?: true
    user_uuid?: true
    school_uuid?: true
    branch_uuid?: true
  }

  export type BranchAccessCountAggregateInputType = {
    id?: true
    role?: true
    user_uuid?: true
    school_uuid?: true
    branch_uuid?: true
    _all?: true
  }

  export type BranchAccessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BranchAccess to aggregate.
     */
    where?: BranchAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BranchAccesses to fetch.
     */
    orderBy?: BranchAccessOrderByWithRelationInput | BranchAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BranchAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BranchAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BranchAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BranchAccesses
    **/
    _count?: true | BranchAccessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BranchAccessAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BranchAccessSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BranchAccessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BranchAccessMaxAggregateInputType
  }

  export type GetBranchAccessAggregateType<T extends BranchAccessAggregateArgs> = {
        [P in keyof T & keyof AggregateBranchAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBranchAccess[P]>
      : GetScalarType<T[P], AggregateBranchAccess[P]>
  }




  export type BranchAccessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BranchAccessWhereInput
    orderBy?: BranchAccessOrderByWithAggregationInput | BranchAccessOrderByWithAggregationInput[]
    by: BranchAccessScalarFieldEnum[] | BranchAccessScalarFieldEnum
    having?: BranchAccessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BranchAccessCountAggregateInputType | true
    _avg?: BranchAccessAvgAggregateInputType
    _sum?: BranchAccessSumAggregateInputType
    _min?: BranchAccessMinAggregateInputType
    _max?: BranchAccessMaxAggregateInputType
  }

  export type BranchAccessGroupByOutputType = {
    id: number
    role: $Enums.Role
    user_uuid: string
    school_uuid: string
    branch_uuid: string
    _count: BranchAccessCountAggregateOutputType | null
    _avg: BranchAccessAvgAggregateOutputType | null
    _sum: BranchAccessSumAggregateOutputType | null
    _min: BranchAccessMinAggregateOutputType | null
    _max: BranchAccessMaxAggregateOutputType | null
  }

  type GetBranchAccessGroupByPayload<T extends BranchAccessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BranchAccessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BranchAccessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BranchAccessGroupByOutputType[P]>
            : GetScalarType<T[P], BranchAccessGroupByOutputType[P]>
        }
      >
    >


  export type BranchAccessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    user_uuid?: boolean
    school_uuid?: boolean
    branch_uuid?: boolean
    user?: boolean | BranchAccess$userArgs<ExtArgs>
    school?: boolean | BranchAccess$schoolArgs<ExtArgs>
    branch?: boolean | BranchAccess$branchArgs<ExtArgs>
  }, ExtArgs["result"]["branchAccess"]>

  export type BranchAccessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    user_uuid?: boolean
    school_uuid?: boolean
    branch_uuid?: boolean
    user?: boolean | BranchAccess$userArgs<ExtArgs>
    school?: boolean | BranchAccess$schoolArgs<ExtArgs>
    branch?: boolean | BranchAccess$branchArgs<ExtArgs>
  }, ExtArgs["result"]["branchAccess"]>

  export type BranchAccessSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    user_uuid?: boolean
    school_uuid?: boolean
    branch_uuid?: boolean
    user?: boolean | BranchAccess$userArgs<ExtArgs>
    school?: boolean | BranchAccess$schoolArgs<ExtArgs>
    branch?: boolean | BranchAccess$branchArgs<ExtArgs>
  }, ExtArgs["result"]["branchAccess"]>

  export type BranchAccessSelectScalar = {
    id?: boolean
    role?: boolean
    user_uuid?: boolean
    school_uuid?: boolean
    branch_uuid?: boolean
  }

  export type BranchAccessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role" | "user_uuid" | "school_uuid" | "branch_uuid", ExtArgs["result"]["branchAccess"]>
  export type BranchAccessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | BranchAccess$userArgs<ExtArgs>
    school?: boolean | BranchAccess$schoolArgs<ExtArgs>
    branch?: boolean | BranchAccess$branchArgs<ExtArgs>
  }
  export type BranchAccessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | BranchAccess$userArgs<ExtArgs>
    school?: boolean | BranchAccess$schoolArgs<ExtArgs>
    branch?: boolean | BranchAccess$branchArgs<ExtArgs>
  }
  export type BranchAccessIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | BranchAccess$userArgs<ExtArgs>
    school?: boolean | BranchAccess$schoolArgs<ExtArgs>
    branch?: boolean | BranchAccess$branchArgs<ExtArgs>
  }

  export type $BranchAccessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BranchAccess"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      school: Prisma.$SchoolPayload<ExtArgs> | null
      branch: Prisma.$BranchPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      role: $Enums.Role
      user_uuid: string
      school_uuid: string
      branch_uuid: string
    }, ExtArgs["result"]["branchAccess"]>
    composites: {}
  }

  type BranchAccessGetPayload<S extends boolean | null | undefined | BranchAccessDefaultArgs> = $Result.GetResult<Prisma.$BranchAccessPayload, S>

  type BranchAccessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BranchAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BranchAccessCountAggregateInputType | true
    }

  export interface BranchAccessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BranchAccess'], meta: { name: 'BranchAccess' } }
    /**
     * Find zero or one BranchAccess that matches the filter.
     * @param {BranchAccessFindUniqueArgs} args - Arguments to find a BranchAccess
     * @example
     * // Get one BranchAccess
     * const branchAccess = await prisma.branchAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BranchAccessFindUniqueArgs>(args: SelectSubset<T, BranchAccessFindUniqueArgs<ExtArgs>>): Prisma__BranchAccessClient<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BranchAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BranchAccessFindUniqueOrThrowArgs} args - Arguments to find a BranchAccess
     * @example
     * // Get one BranchAccess
     * const branchAccess = await prisma.branchAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BranchAccessFindUniqueOrThrowArgs>(args: SelectSubset<T, BranchAccessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BranchAccessClient<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BranchAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAccessFindFirstArgs} args - Arguments to find a BranchAccess
     * @example
     * // Get one BranchAccess
     * const branchAccess = await prisma.branchAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BranchAccessFindFirstArgs>(args?: SelectSubset<T, BranchAccessFindFirstArgs<ExtArgs>>): Prisma__BranchAccessClient<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BranchAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAccessFindFirstOrThrowArgs} args - Arguments to find a BranchAccess
     * @example
     * // Get one BranchAccess
     * const branchAccess = await prisma.branchAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BranchAccessFindFirstOrThrowArgs>(args?: SelectSubset<T, BranchAccessFindFirstOrThrowArgs<ExtArgs>>): Prisma__BranchAccessClient<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BranchAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BranchAccesses
     * const branchAccesses = await prisma.branchAccess.findMany()
     * 
     * // Get first 10 BranchAccesses
     * const branchAccesses = await prisma.branchAccess.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const branchAccessWithIdOnly = await prisma.branchAccess.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BranchAccessFindManyArgs>(args?: SelectSubset<T, BranchAccessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BranchAccess.
     * @param {BranchAccessCreateArgs} args - Arguments to create a BranchAccess.
     * @example
     * // Create one BranchAccess
     * const BranchAccess = await prisma.branchAccess.create({
     *   data: {
     *     // ... data to create a BranchAccess
     *   }
     * })
     * 
     */
    create<T extends BranchAccessCreateArgs>(args: SelectSubset<T, BranchAccessCreateArgs<ExtArgs>>): Prisma__BranchAccessClient<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BranchAccesses.
     * @param {BranchAccessCreateManyArgs} args - Arguments to create many BranchAccesses.
     * @example
     * // Create many BranchAccesses
     * const branchAccess = await prisma.branchAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BranchAccessCreateManyArgs>(args?: SelectSubset<T, BranchAccessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BranchAccesses and returns the data saved in the database.
     * @param {BranchAccessCreateManyAndReturnArgs} args - Arguments to create many BranchAccesses.
     * @example
     * // Create many BranchAccesses
     * const branchAccess = await prisma.branchAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BranchAccesses and only return the `id`
     * const branchAccessWithIdOnly = await prisma.branchAccess.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BranchAccessCreateManyAndReturnArgs>(args?: SelectSubset<T, BranchAccessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BranchAccess.
     * @param {BranchAccessDeleteArgs} args - Arguments to delete one BranchAccess.
     * @example
     * // Delete one BranchAccess
     * const BranchAccess = await prisma.branchAccess.delete({
     *   where: {
     *     // ... filter to delete one BranchAccess
     *   }
     * })
     * 
     */
    delete<T extends BranchAccessDeleteArgs>(args: SelectSubset<T, BranchAccessDeleteArgs<ExtArgs>>): Prisma__BranchAccessClient<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BranchAccess.
     * @param {BranchAccessUpdateArgs} args - Arguments to update one BranchAccess.
     * @example
     * // Update one BranchAccess
     * const branchAccess = await prisma.branchAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BranchAccessUpdateArgs>(args: SelectSubset<T, BranchAccessUpdateArgs<ExtArgs>>): Prisma__BranchAccessClient<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BranchAccesses.
     * @param {BranchAccessDeleteManyArgs} args - Arguments to filter BranchAccesses to delete.
     * @example
     * // Delete a few BranchAccesses
     * const { count } = await prisma.branchAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BranchAccessDeleteManyArgs>(args?: SelectSubset<T, BranchAccessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BranchAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BranchAccesses
     * const branchAccess = await prisma.branchAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BranchAccessUpdateManyArgs>(args: SelectSubset<T, BranchAccessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BranchAccesses and returns the data updated in the database.
     * @param {BranchAccessUpdateManyAndReturnArgs} args - Arguments to update many BranchAccesses.
     * @example
     * // Update many BranchAccesses
     * const branchAccess = await prisma.branchAccess.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BranchAccesses and only return the `id`
     * const branchAccessWithIdOnly = await prisma.branchAccess.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BranchAccessUpdateManyAndReturnArgs>(args: SelectSubset<T, BranchAccessUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BranchAccess.
     * @param {BranchAccessUpsertArgs} args - Arguments to update or create a BranchAccess.
     * @example
     * // Update or create a BranchAccess
     * const branchAccess = await prisma.branchAccess.upsert({
     *   create: {
     *     // ... data to create a BranchAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BranchAccess we want to update
     *   }
     * })
     */
    upsert<T extends BranchAccessUpsertArgs>(args: SelectSubset<T, BranchAccessUpsertArgs<ExtArgs>>): Prisma__BranchAccessClient<$Result.GetResult<Prisma.$BranchAccessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BranchAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAccessCountArgs} args - Arguments to filter BranchAccesses to count.
     * @example
     * // Count the number of BranchAccesses
     * const count = await prisma.branchAccess.count({
     *   where: {
     *     // ... the filter for the BranchAccesses we want to count
     *   }
     * })
    **/
    count<T extends BranchAccessCountArgs>(
      args?: Subset<T, BranchAccessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BranchAccessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BranchAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BranchAccessAggregateArgs>(args: Subset<T, BranchAccessAggregateArgs>): Prisma.PrismaPromise<GetBranchAccessAggregateType<T>>

    /**
     * Group by BranchAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAccessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BranchAccessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BranchAccessGroupByArgs['orderBy'] }
        : { orderBy?: BranchAccessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BranchAccessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBranchAccessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BranchAccess model
   */
  readonly fields: BranchAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BranchAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BranchAccessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends BranchAccess$userArgs<ExtArgs> = {}>(args?: Subset<T, BranchAccess$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    school<T extends BranchAccess$schoolArgs<ExtArgs> = {}>(args?: Subset<T, BranchAccess$schoolArgs<ExtArgs>>): Prisma__SchoolClient<$Result.GetResult<Prisma.$SchoolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    branch<T extends BranchAccess$branchArgs<ExtArgs> = {}>(args?: Subset<T, BranchAccess$branchArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BranchAccess model
   */
  interface BranchAccessFieldRefs {
    readonly id: FieldRef<"BranchAccess", 'Int'>
    readonly role: FieldRef<"BranchAccess", 'Role'>
    readonly user_uuid: FieldRef<"BranchAccess", 'String'>
    readonly school_uuid: FieldRef<"BranchAccess", 'String'>
    readonly branch_uuid: FieldRef<"BranchAccess", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BranchAccess findUnique
   */
  export type BranchAccessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    /**
     * Filter, which BranchAccess to fetch.
     */
    where: BranchAccessWhereUniqueInput
  }

  /**
   * BranchAccess findUniqueOrThrow
   */
  export type BranchAccessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    /**
     * Filter, which BranchAccess to fetch.
     */
    where: BranchAccessWhereUniqueInput
  }

  /**
   * BranchAccess findFirst
   */
  export type BranchAccessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    /**
     * Filter, which BranchAccess to fetch.
     */
    where?: BranchAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BranchAccesses to fetch.
     */
    orderBy?: BranchAccessOrderByWithRelationInput | BranchAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BranchAccesses.
     */
    cursor?: BranchAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BranchAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BranchAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BranchAccesses.
     */
    distinct?: BranchAccessScalarFieldEnum | BranchAccessScalarFieldEnum[]
  }

  /**
   * BranchAccess findFirstOrThrow
   */
  export type BranchAccessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    /**
     * Filter, which BranchAccess to fetch.
     */
    where?: BranchAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BranchAccesses to fetch.
     */
    orderBy?: BranchAccessOrderByWithRelationInput | BranchAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BranchAccesses.
     */
    cursor?: BranchAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BranchAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BranchAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BranchAccesses.
     */
    distinct?: BranchAccessScalarFieldEnum | BranchAccessScalarFieldEnum[]
  }

  /**
   * BranchAccess findMany
   */
  export type BranchAccessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    /**
     * Filter, which BranchAccesses to fetch.
     */
    where?: BranchAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BranchAccesses to fetch.
     */
    orderBy?: BranchAccessOrderByWithRelationInput | BranchAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BranchAccesses.
     */
    cursor?: BranchAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BranchAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BranchAccesses.
     */
    skip?: number
    distinct?: BranchAccessScalarFieldEnum | BranchAccessScalarFieldEnum[]
  }

  /**
   * BranchAccess create
   */
  export type BranchAccessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    /**
     * The data needed to create a BranchAccess.
     */
    data: XOR<BranchAccessCreateInput, BranchAccessUncheckedCreateInput>
  }

  /**
   * BranchAccess createMany
   */
  export type BranchAccessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BranchAccesses.
     */
    data: BranchAccessCreateManyInput | BranchAccessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BranchAccess createManyAndReturn
   */
  export type BranchAccessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * The data used to create many BranchAccesses.
     */
    data: BranchAccessCreateManyInput | BranchAccessCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BranchAccess update
   */
  export type BranchAccessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    /**
     * The data needed to update a BranchAccess.
     */
    data: XOR<BranchAccessUpdateInput, BranchAccessUncheckedUpdateInput>
    /**
     * Choose, which BranchAccess to update.
     */
    where: BranchAccessWhereUniqueInput
  }

  /**
   * BranchAccess updateMany
   */
  export type BranchAccessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BranchAccesses.
     */
    data: XOR<BranchAccessUpdateManyMutationInput, BranchAccessUncheckedUpdateManyInput>
    /**
     * Filter which BranchAccesses to update
     */
    where?: BranchAccessWhereInput
    /**
     * Limit how many BranchAccesses to update.
     */
    limit?: number
  }

  /**
   * BranchAccess updateManyAndReturn
   */
  export type BranchAccessUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * The data used to update BranchAccesses.
     */
    data: XOR<BranchAccessUpdateManyMutationInput, BranchAccessUncheckedUpdateManyInput>
    /**
     * Filter which BranchAccesses to update
     */
    where?: BranchAccessWhereInput
    /**
     * Limit how many BranchAccesses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BranchAccess upsert
   */
  export type BranchAccessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    /**
     * The filter to search for the BranchAccess to update in case it exists.
     */
    where: BranchAccessWhereUniqueInput
    /**
     * In case the BranchAccess found by the `where` argument doesn't exist, create a new BranchAccess with this data.
     */
    create: XOR<BranchAccessCreateInput, BranchAccessUncheckedCreateInput>
    /**
     * In case the BranchAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BranchAccessUpdateInput, BranchAccessUncheckedUpdateInput>
  }

  /**
   * BranchAccess delete
   */
  export type BranchAccessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
    /**
     * Filter which BranchAccess to delete.
     */
    where: BranchAccessWhereUniqueInput
  }

  /**
   * BranchAccess deleteMany
   */
  export type BranchAccessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BranchAccesses to delete
     */
    where?: BranchAccessWhereInput
    /**
     * Limit how many BranchAccesses to delete.
     */
    limit?: number
  }

  /**
   * BranchAccess.user
   */
  export type BranchAccess$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * BranchAccess.school
   */
  export type BranchAccess$schoolArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the School
     */
    select?: SchoolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the School
     */
    omit?: SchoolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolInclude<ExtArgs> | null
    where?: SchoolWhereInput
  }

  /**
   * BranchAccess.branch
   */
  export type BranchAccess$branchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    where?: BranchWhereInput
  }

  /**
   * BranchAccess without action
   */
  export type BranchAccessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchAccess
     */
    select?: BranchAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BranchAccess
     */
    omit?: BranchAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchAccessInclude<ExtArgs> | null
  }


  /**
   * Model Student
   */

  export type AggregateStudent = {
    _count: StudentCountAggregateOutputType | null
    _avg: StudentAvgAggregateOutputType | null
    _sum: StudentSumAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  export type StudentAvgAggregateOutputType = {
    id: number | null
  }

  export type StudentSumAggregateOutputType = {
    id: number | null
  }

  export type StudentMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    parent_uuid: string | null
    branch_uuid: string | null
    class_uuid: string | null
    reg_number: string | null
    name: string | null
    avatar: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type StudentMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    parent_uuid: string | null
    branch_uuid: string | null
    class_uuid: string | null
    reg_number: string | null
    name: string | null
    avatar: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type StudentCountAggregateOutputType = {
    id: number
    uuid: number
    parent_uuid: number
    branch_uuid: number
    class_uuid: number
    reg_number: number
    name: number
    avatar: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type StudentAvgAggregateInputType = {
    id?: true
  }

  export type StudentSumAggregateInputType = {
    id?: true
  }

  export type StudentMinAggregateInputType = {
    id?: true
    uuid?: true
    parent_uuid?: true
    branch_uuid?: true
    class_uuid?: true
    reg_number?: true
    name?: true
    avatar?: true
    created_at?: true
    updated_at?: true
  }

  export type StudentMaxAggregateInputType = {
    id?: true
    uuid?: true
    parent_uuid?: true
    branch_uuid?: true
    class_uuid?: true
    reg_number?: true
    name?: true
    avatar?: true
    created_at?: true
    updated_at?: true
  }

  export type StudentCountAggregateInputType = {
    id?: true
    uuid?: true
    parent_uuid?: true
    branch_uuid?: true
    class_uuid?: true
    reg_number?: true
    name?: true
    avatar?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type StudentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Student to aggregate.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Students
    **/
    _count?: true | StudentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentMaxAggregateInputType
  }

  export type GetStudentAggregateType<T extends StudentAggregateArgs> = {
        [P in keyof T & keyof AggregateStudent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudent[P]>
      : GetScalarType<T[P], AggregateStudent[P]>
  }




  export type StudentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithAggregationInput | StudentOrderByWithAggregationInput[]
    by: StudentScalarFieldEnum[] | StudentScalarFieldEnum
    having?: StudentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentCountAggregateInputType | true
    _avg?: StudentAvgAggregateInputType
    _sum?: StudentSumAggregateInputType
    _min?: StudentMinAggregateInputType
    _max?: StudentMaxAggregateInputType
  }

  export type StudentGroupByOutputType = {
    id: number
    uuid: string
    parent_uuid: string
    branch_uuid: string
    class_uuid: string
    reg_number: string
    name: string
    avatar: string | null
    created_at: Date
    updated_at: Date
    _count: StudentCountAggregateOutputType | null
    _avg: StudentAvgAggregateOutputType | null
    _sum: StudentSumAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  type GetStudentGroupByPayload<T extends StudentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentGroupByOutputType[P]>
            : GetScalarType<T[P], StudentGroupByOutputType[P]>
        }
      >
    >


  export type StudentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    parent_uuid?: boolean
    branch_uuid?: boolean
    class_uuid?: boolean
    reg_number?: boolean
    name?: boolean
    avatar?: boolean
    created_at?: boolean
    updated_at?: boolean
    parent?: boolean | UserDefaultArgs<ExtArgs>
    branch?: boolean | BranchDefaultArgs<ExtArgs>
    class?: boolean | ClassDefaultArgs<ExtArgs>
    results?: boolean | Student$resultsArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    parent_uuid?: boolean
    branch_uuid?: boolean
    class_uuid?: boolean
    reg_number?: boolean
    name?: boolean
    avatar?: boolean
    created_at?: boolean
    updated_at?: boolean
    parent?: boolean | UserDefaultArgs<ExtArgs>
    branch?: boolean | BranchDefaultArgs<ExtArgs>
    class?: boolean | ClassDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    parent_uuid?: boolean
    branch_uuid?: boolean
    class_uuid?: boolean
    reg_number?: boolean
    name?: boolean
    avatar?: boolean
    created_at?: boolean
    updated_at?: boolean
    parent?: boolean | UserDefaultArgs<ExtArgs>
    branch?: boolean | BranchDefaultArgs<ExtArgs>
    class?: boolean | ClassDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectScalar = {
    id?: boolean
    uuid?: boolean
    parent_uuid?: boolean
    branch_uuid?: boolean
    class_uuid?: boolean
    reg_number?: boolean
    name?: boolean
    avatar?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type StudentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "parent_uuid" | "branch_uuid" | "class_uuid" | "reg_number" | "name" | "avatar" | "created_at" | "updated_at", ExtArgs["result"]["student"]>
  export type StudentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | UserDefaultArgs<ExtArgs>
    branch?: boolean | BranchDefaultArgs<ExtArgs>
    class?: boolean | ClassDefaultArgs<ExtArgs>
    results?: boolean | Student$resultsArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StudentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | UserDefaultArgs<ExtArgs>
    branch?: boolean | BranchDefaultArgs<ExtArgs>
    class?: boolean | ClassDefaultArgs<ExtArgs>
  }
  export type StudentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | UserDefaultArgs<ExtArgs>
    branch?: boolean | BranchDefaultArgs<ExtArgs>
    class?: boolean | ClassDefaultArgs<ExtArgs>
  }

  export type $StudentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Student"
    objects: {
      parent: Prisma.$UserPayload<ExtArgs>
      branch: Prisma.$BranchPayload<ExtArgs>
      class: Prisma.$ClassPayload<ExtArgs>
      results: Prisma.$ResultPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      parent_uuid: string
      branch_uuid: string
      class_uuid: string
      reg_number: string
      name: string
      avatar: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["student"]>
    composites: {}
  }

  type StudentGetPayload<S extends boolean | null | undefined | StudentDefaultArgs> = $Result.GetResult<Prisma.$StudentPayload, S>

  type StudentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentCountAggregateInputType | true
    }

  export interface StudentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Student'], meta: { name: 'Student' } }
    /**
     * Find zero or one Student that matches the filter.
     * @param {StudentFindUniqueArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentFindUniqueArgs>(args: SelectSubset<T, StudentFindUniqueArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Student that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentFindUniqueOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentFindFirstArgs>(args?: SelectSubset<T, StudentFindFirstArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Students that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Students
     * const students = await prisma.student.findMany()
     * 
     * // Get first 10 Students
     * const students = await prisma.student.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentWithIdOnly = await prisma.student.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentFindManyArgs>(args?: SelectSubset<T, StudentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Student.
     * @param {StudentCreateArgs} args - Arguments to create a Student.
     * @example
     * // Create one Student
     * const Student = await prisma.student.create({
     *   data: {
     *     // ... data to create a Student
     *   }
     * })
     * 
     */
    create<T extends StudentCreateArgs>(args: SelectSubset<T, StudentCreateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Students.
     * @param {StudentCreateManyArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentCreateManyArgs>(args?: SelectSubset<T, StudentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Students and returns the data saved in the database.
     * @param {StudentCreateManyAndReturnArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Student.
     * @param {StudentDeleteArgs} args - Arguments to delete one Student.
     * @example
     * // Delete one Student
     * const Student = await prisma.student.delete({
     *   where: {
     *     // ... filter to delete one Student
     *   }
     * })
     * 
     */
    delete<T extends StudentDeleteArgs>(args: SelectSubset<T, StudentDeleteArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Student.
     * @param {StudentUpdateArgs} args - Arguments to update one Student.
     * @example
     * // Update one Student
     * const student = await prisma.student.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentUpdateArgs>(args: SelectSubset<T, StudentUpdateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Students.
     * @param {StudentDeleteManyArgs} args - Arguments to filter Students to delete.
     * @example
     * // Delete a few Students
     * const { count } = await prisma.student.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentDeleteManyArgs>(args?: SelectSubset<T, StudentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentUpdateManyArgs>(args: SelectSubset<T, StudentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students and returns the data updated in the database.
     * @param {StudentUpdateManyAndReturnArgs} args - Arguments to update many Students.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StudentUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Student.
     * @param {StudentUpsertArgs} args - Arguments to update or create a Student.
     * @example
     * // Update or create a Student
     * const student = await prisma.student.upsert({
     *   create: {
     *     // ... data to create a Student
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Student we want to update
     *   }
     * })
     */
    upsert<T extends StudentUpsertArgs>(args: SelectSubset<T, StudentUpsertArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCountArgs} args - Arguments to filter Students to count.
     * @example
     * // Count the number of Students
     * const count = await prisma.student.count({
     *   where: {
     *     // ... the filter for the Students we want to count
     *   }
     * })
    **/
    count<T extends StudentCountArgs>(
      args?: Subset<T, StudentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentAggregateArgs>(args: Subset<T, StudentAggregateArgs>): Prisma.PrismaPromise<GetStudentAggregateType<T>>

    /**
     * Group by Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentGroupByArgs['orderBy'] }
        : { orderBy?: StudentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Student model
   */
  readonly fields: StudentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Student.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    branch<T extends BranchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BranchDefaultArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    class<T extends ClassDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClassDefaultArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    results<T extends Student$resultsArgs<ExtArgs> = {}>(args?: Subset<T, Student$resultsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Student model
   */
  interface StudentFieldRefs {
    readonly id: FieldRef<"Student", 'Int'>
    readonly uuid: FieldRef<"Student", 'String'>
    readonly parent_uuid: FieldRef<"Student", 'String'>
    readonly branch_uuid: FieldRef<"Student", 'String'>
    readonly class_uuid: FieldRef<"Student", 'String'>
    readonly reg_number: FieldRef<"Student", 'String'>
    readonly name: FieldRef<"Student", 'String'>
    readonly avatar: FieldRef<"Student", 'String'>
    readonly created_at: FieldRef<"Student", 'DateTime'>
    readonly updated_at: FieldRef<"Student", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Student findUnique
   */
  export type StudentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findUniqueOrThrow
   */
  export type StudentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findFirst
   */
  export type StudentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findFirstOrThrow
   */
  export type StudentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findMany
   */
  export type StudentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Students to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student create
   */
  export type StudentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to create a Student.
     */
    data: XOR<StudentCreateInput, StudentUncheckedCreateInput>
  }

  /**
   * Student createMany
   */
  export type StudentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Student createManyAndReturn
   */
  export type StudentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Student update
   */
  export type StudentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to update a Student.
     */
    data: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
    /**
     * Choose, which Student to update.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student updateMany
   */
  export type StudentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
  }

  /**
   * Student updateManyAndReturn
   */
  export type StudentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Student upsert
   */
  export type StudentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The filter to search for the Student to update in case it exists.
     */
    where: StudentWhereUniqueInput
    /**
     * In case the Student found by the `where` argument doesn't exist, create a new Student with this data.
     */
    create: XOR<StudentCreateInput, StudentUncheckedCreateInput>
    /**
     * In case the Student was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
  }

  /**
   * Student delete
   */
  export type StudentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter which Student to delete.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student deleteMany
   */
  export type StudentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Students to delete
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to delete.
     */
    limit?: number
  }

  /**
   * Student.results
   */
  export type Student$resultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    where?: ResultWhereInput
    orderBy?: ResultOrderByWithRelationInput | ResultOrderByWithRelationInput[]
    cursor?: ResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResultScalarFieldEnum | ResultScalarFieldEnum[]
  }

  /**
   * Student without action
   */
  export type StudentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
  }


  /**
   * Model Class
   */

  export type AggregateClass = {
    _count: ClassCountAggregateOutputType | null
    _avg: ClassAvgAggregateOutputType | null
    _sum: ClassSumAggregateOutputType | null
    _min: ClassMinAggregateOutputType | null
    _max: ClassMaxAggregateOutputType | null
  }

  export type ClassAvgAggregateOutputType = {
    id: number | null
  }

  export type ClassSumAggregateOutputType = {
    id: number | null
  }

  export type ClassMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    branch_uuid: string | null
    name: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ClassMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    branch_uuid: string | null
    name: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ClassCountAggregateOutputType = {
    id: number
    uuid: number
    branch_uuid: number
    name: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ClassAvgAggregateInputType = {
    id?: true
  }

  export type ClassSumAggregateInputType = {
    id?: true
  }

  export type ClassMinAggregateInputType = {
    id?: true
    uuid?: true
    branch_uuid?: true
    name?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type ClassMaxAggregateInputType = {
    id?: true
    uuid?: true
    branch_uuid?: true
    name?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type ClassCountAggregateInputType = {
    id?: true
    uuid?: true
    branch_uuid?: true
    name?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ClassAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Class to aggregate.
     */
    where?: ClassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classes to fetch.
     */
    orderBy?: ClassOrderByWithRelationInput | ClassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Classes
    **/
    _count?: true | ClassCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClassAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClassSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClassMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClassMaxAggregateInputType
  }

  export type GetClassAggregateType<T extends ClassAggregateArgs> = {
        [P in keyof T & keyof AggregateClass]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClass[P]>
      : GetScalarType<T[P], AggregateClass[P]>
  }




  export type ClassGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassWhereInput
    orderBy?: ClassOrderByWithAggregationInput | ClassOrderByWithAggregationInput[]
    by: ClassScalarFieldEnum[] | ClassScalarFieldEnum
    having?: ClassScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClassCountAggregateInputType | true
    _avg?: ClassAvgAggregateInputType
    _sum?: ClassSumAggregateInputType
    _min?: ClassMinAggregateInputType
    _max?: ClassMaxAggregateInputType
  }

  export type ClassGroupByOutputType = {
    id: number
    uuid: string
    branch_uuid: string
    name: string
    status: string
    created_at: Date
    updated_at: Date
    _count: ClassCountAggregateOutputType | null
    _avg: ClassAvgAggregateOutputType | null
    _sum: ClassSumAggregateOutputType | null
    _min: ClassMinAggregateOutputType | null
    _max: ClassMaxAggregateOutputType | null
  }

  type GetClassGroupByPayload<T extends ClassGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClassGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClassGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClassGroupByOutputType[P]>
            : GetScalarType<T[P], ClassGroupByOutputType[P]>
        }
      >
    >


  export type ClassSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    branch_uuid?: boolean
    name?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    branch?: boolean | Class$branchArgs<ExtArgs>
    subjects?: boolean | Class$subjectsArgs<ExtArgs>
    students?: boolean | Class$studentsArgs<ExtArgs>
    _count?: boolean | ClassCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["class"]>

  export type ClassSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    branch_uuid?: boolean
    name?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    branch?: boolean | Class$branchArgs<ExtArgs>
  }, ExtArgs["result"]["class"]>

  export type ClassSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    branch_uuid?: boolean
    name?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    branch?: boolean | Class$branchArgs<ExtArgs>
  }, ExtArgs["result"]["class"]>

  export type ClassSelectScalar = {
    id?: boolean
    uuid?: boolean
    branch_uuid?: boolean
    name?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ClassOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "branch_uuid" | "name" | "status" | "created_at" | "updated_at", ExtArgs["result"]["class"]>
  export type ClassInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    branch?: boolean | Class$branchArgs<ExtArgs>
    subjects?: boolean | Class$subjectsArgs<ExtArgs>
    students?: boolean | Class$studentsArgs<ExtArgs>
    _count?: boolean | ClassCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClassIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    branch?: boolean | Class$branchArgs<ExtArgs>
  }
  export type ClassIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    branch?: boolean | Class$branchArgs<ExtArgs>
  }

  export type $ClassPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Class"
    objects: {
      branch: Prisma.$BranchPayload<ExtArgs> | null
      subjects: Prisma.$SubjectPayload<ExtArgs>[]
      students: Prisma.$StudentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      branch_uuid: string
      name: string
      status: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["class"]>
    composites: {}
  }

  type ClassGetPayload<S extends boolean | null | undefined | ClassDefaultArgs> = $Result.GetResult<Prisma.$ClassPayload, S>

  type ClassCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClassFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClassCountAggregateInputType | true
    }

  export interface ClassDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Class'], meta: { name: 'Class' } }
    /**
     * Find zero or one Class that matches the filter.
     * @param {ClassFindUniqueArgs} args - Arguments to find a Class
     * @example
     * // Get one Class
     * const class = await prisma.class.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClassFindUniqueArgs>(args: SelectSubset<T, ClassFindUniqueArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Class that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClassFindUniqueOrThrowArgs} args - Arguments to find a Class
     * @example
     * // Get one Class
     * const class = await prisma.class.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClassFindUniqueOrThrowArgs>(args: SelectSubset<T, ClassFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Class that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassFindFirstArgs} args - Arguments to find a Class
     * @example
     * // Get one Class
     * const class = await prisma.class.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClassFindFirstArgs>(args?: SelectSubset<T, ClassFindFirstArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Class that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassFindFirstOrThrowArgs} args - Arguments to find a Class
     * @example
     * // Get one Class
     * const class = await prisma.class.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClassFindFirstOrThrowArgs>(args?: SelectSubset<T, ClassFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Classes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Classes
     * const classes = await prisma.class.findMany()
     * 
     * // Get first 10 Classes
     * const classes = await prisma.class.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const classWithIdOnly = await prisma.class.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClassFindManyArgs>(args?: SelectSubset<T, ClassFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Class.
     * @param {ClassCreateArgs} args - Arguments to create a Class.
     * @example
     * // Create one Class
     * const Class = await prisma.class.create({
     *   data: {
     *     // ... data to create a Class
     *   }
     * })
     * 
     */
    create<T extends ClassCreateArgs>(args: SelectSubset<T, ClassCreateArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Classes.
     * @param {ClassCreateManyArgs} args - Arguments to create many Classes.
     * @example
     * // Create many Classes
     * const class = await prisma.class.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClassCreateManyArgs>(args?: SelectSubset<T, ClassCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Classes and returns the data saved in the database.
     * @param {ClassCreateManyAndReturnArgs} args - Arguments to create many Classes.
     * @example
     * // Create many Classes
     * const class = await prisma.class.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Classes and only return the `id`
     * const classWithIdOnly = await prisma.class.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClassCreateManyAndReturnArgs>(args?: SelectSubset<T, ClassCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Class.
     * @param {ClassDeleteArgs} args - Arguments to delete one Class.
     * @example
     * // Delete one Class
     * const Class = await prisma.class.delete({
     *   where: {
     *     // ... filter to delete one Class
     *   }
     * })
     * 
     */
    delete<T extends ClassDeleteArgs>(args: SelectSubset<T, ClassDeleteArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Class.
     * @param {ClassUpdateArgs} args - Arguments to update one Class.
     * @example
     * // Update one Class
     * const class = await prisma.class.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClassUpdateArgs>(args: SelectSubset<T, ClassUpdateArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Classes.
     * @param {ClassDeleteManyArgs} args - Arguments to filter Classes to delete.
     * @example
     * // Delete a few Classes
     * const { count } = await prisma.class.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClassDeleteManyArgs>(args?: SelectSubset<T, ClassDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Classes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Classes
     * const class = await prisma.class.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClassUpdateManyArgs>(args: SelectSubset<T, ClassUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Classes and returns the data updated in the database.
     * @param {ClassUpdateManyAndReturnArgs} args - Arguments to update many Classes.
     * @example
     * // Update many Classes
     * const class = await prisma.class.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Classes and only return the `id`
     * const classWithIdOnly = await prisma.class.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClassUpdateManyAndReturnArgs>(args: SelectSubset<T, ClassUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Class.
     * @param {ClassUpsertArgs} args - Arguments to update or create a Class.
     * @example
     * // Update or create a Class
     * const class = await prisma.class.upsert({
     *   create: {
     *     // ... data to create a Class
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Class we want to update
     *   }
     * })
     */
    upsert<T extends ClassUpsertArgs>(args: SelectSubset<T, ClassUpsertArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Classes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassCountArgs} args - Arguments to filter Classes to count.
     * @example
     * // Count the number of Classes
     * const count = await prisma.class.count({
     *   where: {
     *     // ... the filter for the Classes we want to count
     *   }
     * })
    **/
    count<T extends ClassCountArgs>(
      args?: Subset<T, ClassCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClassCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Class.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClassAggregateArgs>(args: Subset<T, ClassAggregateArgs>): Prisma.PrismaPromise<GetClassAggregateType<T>>

    /**
     * Group by Class.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClassGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClassGroupByArgs['orderBy'] }
        : { orderBy?: ClassGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClassGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Class model
   */
  readonly fields: ClassFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Class.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClassClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    branch<T extends Class$branchArgs<ExtArgs> = {}>(args?: Subset<T, Class$branchArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    subjects<T extends Class$subjectsArgs<ExtArgs> = {}>(args?: Subset<T, Class$subjectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    students<T extends Class$studentsArgs<ExtArgs> = {}>(args?: Subset<T, Class$studentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Class model
   */
  interface ClassFieldRefs {
    readonly id: FieldRef<"Class", 'Int'>
    readonly uuid: FieldRef<"Class", 'String'>
    readonly branch_uuid: FieldRef<"Class", 'String'>
    readonly name: FieldRef<"Class", 'String'>
    readonly status: FieldRef<"Class", 'String'>
    readonly created_at: FieldRef<"Class", 'DateTime'>
    readonly updated_at: FieldRef<"Class", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Class findUnique
   */
  export type ClassFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    /**
     * Filter, which Class to fetch.
     */
    where: ClassWhereUniqueInput
  }

  /**
   * Class findUniqueOrThrow
   */
  export type ClassFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    /**
     * Filter, which Class to fetch.
     */
    where: ClassWhereUniqueInput
  }

  /**
   * Class findFirst
   */
  export type ClassFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    /**
     * Filter, which Class to fetch.
     */
    where?: ClassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classes to fetch.
     */
    orderBy?: ClassOrderByWithRelationInput | ClassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Classes.
     */
    cursor?: ClassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Classes.
     */
    distinct?: ClassScalarFieldEnum | ClassScalarFieldEnum[]
  }

  /**
   * Class findFirstOrThrow
   */
  export type ClassFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    /**
     * Filter, which Class to fetch.
     */
    where?: ClassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classes to fetch.
     */
    orderBy?: ClassOrderByWithRelationInput | ClassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Classes.
     */
    cursor?: ClassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Classes.
     */
    distinct?: ClassScalarFieldEnum | ClassScalarFieldEnum[]
  }

  /**
   * Class findMany
   */
  export type ClassFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    /**
     * Filter, which Classes to fetch.
     */
    where?: ClassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classes to fetch.
     */
    orderBy?: ClassOrderByWithRelationInput | ClassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Classes.
     */
    cursor?: ClassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classes.
     */
    skip?: number
    distinct?: ClassScalarFieldEnum | ClassScalarFieldEnum[]
  }

  /**
   * Class create
   */
  export type ClassCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    /**
     * The data needed to create a Class.
     */
    data: XOR<ClassCreateInput, ClassUncheckedCreateInput>
  }

  /**
   * Class createMany
   */
  export type ClassCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Classes.
     */
    data: ClassCreateManyInput | ClassCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Class createManyAndReturn
   */
  export type ClassCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * The data used to create many Classes.
     */
    data: ClassCreateManyInput | ClassCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Class update
   */
  export type ClassUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    /**
     * The data needed to update a Class.
     */
    data: XOR<ClassUpdateInput, ClassUncheckedUpdateInput>
    /**
     * Choose, which Class to update.
     */
    where: ClassWhereUniqueInput
  }

  /**
   * Class updateMany
   */
  export type ClassUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Classes.
     */
    data: XOR<ClassUpdateManyMutationInput, ClassUncheckedUpdateManyInput>
    /**
     * Filter which Classes to update
     */
    where?: ClassWhereInput
    /**
     * Limit how many Classes to update.
     */
    limit?: number
  }

  /**
   * Class updateManyAndReturn
   */
  export type ClassUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * The data used to update Classes.
     */
    data: XOR<ClassUpdateManyMutationInput, ClassUncheckedUpdateManyInput>
    /**
     * Filter which Classes to update
     */
    where?: ClassWhereInput
    /**
     * Limit how many Classes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Class upsert
   */
  export type ClassUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    /**
     * The filter to search for the Class to update in case it exists.
     */
    where: ClassWhereUniqueInput
    /**
     * In case the Class found by the `where` argument doesn't exist, create a new Class with this data.
     */
    create: XOR<ClassCreateInput, ClassUncheckedCreateInput>
    /**
     * In case the Class was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClassUpdateInput, ClassUncheckedUpdateInput>
  }

  /**
   * Class delete
   */
  export type ClassDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    /**
     * Filter which Class to delete.
     */
    where: ClassWhereUniqueInput
  }

  /**
   * Class deleteMany
   */
  export type ClassDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Classes to delete
     */
    where?: ClassWhereInput
    /**
     * Limit how many Classes to delete.
     */
    limit?: number
  }

  /**
   * Class.branch
   */
  export type Class$branchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    where?: BranchWhereInput
  }

  /**
   * Class.subjects
   */
  export type Class$subjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    where?: SubjectWhereInput
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    cursor?: SubjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * Class.students
   */
  export type Class$studentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    cursor?: StudentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Class without action
   */
  export type ClassDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
  }


  /**
   * Model Subject
   */

  export type AggregateSubject = {
    _count: SubjectCountAggregateOutputType | null
    _avg: SubjectAvgAggregateOutputType | null
    _sum: SubjectSumAggregateOutputType | null
    _min: SubjectMinAggregateOutputType | null
    _max: SubjectMaxAggregateOutputType | null
  }

  export type SubjectAvgAggregateOutputType = {
    id: number | null
  }

  export type SubjectSumAggregateOutputType = {
    id: number | null
  }

  export type SubjectMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    class_uuid: string | null
    name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubjectMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    class_uuid: string | null
    name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubjectCountAggregateOutputType = {
    id: number
    uuid: number
    class_uuid: number
    name: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type SubjectAvgAggregateInputType = {
    id?: true
  }

  export type SubjectSumAggregateInputType = {
    id?: true
  }

  export type SubjectMinAggregateInputType = {
    id?: true
    uuid?: true
    class_uuid?: true
    name?: true
    created_at?: true
    updated_at?: true
  }

  export type SubjectMaxAggregateInputType = {
    id?: true
    uuid?: true
    class_uuid?: true
    name?: true
    created_at?: true
    updated_at?: true
  }

  export type SubjectCountAggregateInputType = {
    id?: true
    uuid?: true
    class_uuid?: true
    name?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type SubjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subject to aggregate.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subjects
    **/
    _count?: true | SubjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubjectMaxAggregateInputType
  }

  export type GetSubjectAggregateType<T extends SubjectAggregateArgs> = {
        [P in keyof T & keyof AggregateSubject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubject[P]>
      : GetScalarType<T[P], AggregateSubject[P]>
  }




  export type SubjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubjectWhereInput
    orderBy?: SubjectOrderByWithAggregationInput | SubjectOrderByWithAggregationInput[]
    by: SubjectScalarFieldEnum[] | SubjectScalarFieldEnum
    having?: SubjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubjectCountAggregateInputType | true
    _avg?: SubjectAvgAggregateInputType
    _sum?: SubjectSumAggregateInputType
    _min?: SubjectMinAggregateInputType
    _max?: SubjectMaxAggregateInputType
  }

  export type SubjectGroupByOutputType = {
    id: number
    uuid: string
    class_uuid: string
    name: string
    created_at: Date
    updated_at: Date
    _count: SubjectCountAggregateOutputType | null
    _avg: SubjectAvgAggregateOutputType | null
    _sum: SubjectSumAggregateOutputType | null
    _min: SubjectMinAggregateOutputType | null
    _max: SubjectMaxAggregateOutputType | null
  }

  type GetSubjectGroupByPayload<T extends SubjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubjectGroupByOutputType[P]>
            : GetScalarType<T[P], SubjectGroupByOutputType[P]>
        }
      >
    >


  export type SubjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    class_uuid?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
    class?: boolean | Subject$classArgs<ExtArgs>
  }, ExtArgs["result"]["subject"]>

  export type SubjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    class_uuid?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
    class?: boolean | Subject$classArgs<ExtArgs>
  }, ExtArgs["result"]["subject"]>

  export type SubjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    class_uuid?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
    class?: boolean | Subject$classArgs<ExtArgs>
  }, ExtArgs["result"]["subject"]>

  export type SubjectSelectScalar = {
    id?: boolean
    uuid?: boolean
    class_uuid?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type SubjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "class_uuid" | "name" | "created_at" | "updated_at", ExtArgs["result"]["subject"]>
  export type SubjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    class?: boolean | Subject$classArgs<ExtArgs>
  }
  export type SubjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    class?: boolean | Subject$classArgs<ExtArgs>
  }
  export type SubjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    class?: boolean | Subject$classArgs<ExtArgs>
  }

  export type $SubjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subject"
    objects: {
      class: Prisma.$ClassPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      class_uuid: string
      name: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["subject"]>
    composites: {}
  }

  type SubjectGetPayload<S extends boolean | null | undefined | SubjectDefaultArgs> = $Result.GetResult<Prisma.$SubjectPayload, S>

  type SubjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubjectCountAggregateInputType | true
    }

  export interface SubjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subject'], meta: { name: 'Subject' } }
    /**
     * Find zero or one Subject that matches the filter.
     * @param {SubjectFindUniqueArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubjectFindUniqueArgs>(args: SelectSubset<T, SubjectFindUniqueArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubjectFindUniqueOrThrowArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubjectFindUniqueOrThrowArgs>(args: SelectSubset<T, SubjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectFindFirstArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubjectFindFirstArgs>(args?: SelectSubset<T, SubjectFindFirstArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectFindFirstOrThrowArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubjectFindFirstOrThrowArgs>(args?: SelectSubset<T, SubjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subjects
     * const subjects = await prisma.subject.findMany()
     * 
     * // Get first 10 Subjects
     * const subjects = await prisma.subject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subjectWithIdOnly = await prisma.subject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubjectFindManyArgs>(args?: SelectSubset<T, SubjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subject.
     * @param {SubjectCreateArgs} args - Arguments to create a Subject.
     * @example
     * // Create one Subject
     * const Subject = await prisma.subject.create({
     *   data: {
     *     // ... data to create a Subject
     *   }
     * })
     * 
     */
    create<T extends SubjectCreateArgs>(args: SelectSubset<T, SubjectCreateArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subjects.
     * @param {SubjectCreateManyArgs} args - Arguments to create many Subjects.
     * @example
     * // Create many Subjects
     * const subject = await prisma.subject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubjectCreateManyArgs>(args?: SelectSubset<T, SubjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subjects and returns the data saved in the database.
     * @param {SubjectCreateManyAndReturnArgs} args - Arguments to create many Subjects.
     * @example
     * // Create many Subjects
     * const subject = await prisma.subject.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subjects and only return the `id`
     * const subjectWithIdOnly = await prisma.subject.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubjectCreateManyAndReturnArgs>(args?: SelectSubset<T, SubjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subject.
     * @param {SubjectDeleteArgs} args - Arguments to delete one Subject.
     * @example
     * // Delete one Subject
     * const Subject = await prisma.subject.delete({
     *   where: {
     *     // ... filter to delete one Subject
     *   }
     * })
     * 
     */
    delete<T extends SubjectDeleteArgs>(args: SelectSubset<T, SubjectDeleteArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subject.
     * @param {SubjectUpdateArgs} args - Arguments to update one Subject.
     * @example
     * // Update one Subject
     * const subject = await prisma.subject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubjectUpdateArgs>(args: SelectSubset<T, SubjectUpdateArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subjects.
     * @param {SubjectDeleteManyArgs} args - Arguments to filter Subjects to delete.
     * @example
     * // Delete a few Subjects
     * const { count } = await prisma.subject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubjectDeleteManyArgs>(args?: SelectSubset<T, SubjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subjects
     * const subject = await prisma.subject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubjectUpdateManyArgs>(args: SelectSubset<T, SubjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subjects and returns the data updated in the database.
     * @param {SubjectUpdateManyAndReturnArgs} args - Arguments to update many Subjects.
     * @example
     * // Update many Subjects
     * const subject = await prisma.subject.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subjects and only return the `id`
     * const subjectWithIdOnly = await prisma.subject.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubjectUpdateManyAndReturnArgs>(args: SelectSubset<T, SubjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subject.
     * @param {SubjectUpsertArgs} args - Arguments to update or create a Subject.
     * @example
     * // Update or create a Subject
     * const subject = await prisma.subject.upsert({
     *   create: {
     *     // ... data to create a Subject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subject we want to update
     *   }
     * })
     */
    upsert<T extends SubjectUpsertArgs>(args: SelectSubset<T, SubjectUpsertArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectCountArgs} args - Arguments to filter Subjects to count.
     * @example
     * // Count the number of Subjects
     * const count = await prisma.subject.count({
     *   where: {
     *     // ... the filter for the Subjects we want to count
     *   }
     * })
    **/
    count<T extends SubjectCountArgs>(
      args?: Subset<T, SubjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubjectAggregateArgs>(args: Subset<T, SubjectAggregateArgs>): Prisma.PrismaPromise<GetSubjectAggregateType<T>>

    /**
     * Group by Subject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubjectGroupByArgs['orderBy'] }
        : { orderBy?: SubjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subject model
   */
  readonly fields: SubjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    class<T extends Subject$classArgs<ExtArgs> = {}>(args?: Subset<T, Subject$classArgs<ExtArgs>>): Prisma__ClassClient<$Result.GetResult<Prisma.$ClassPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subject model
   */
  interface SubjectFieldRefs {
    readonly id: FieldRef<"Subject", 'Int'>
    readonly uuid: FieldRef<"Subject", 'String'>
    readonly class_uuid: FieldRef<"Subject", 'String'>
    readonly name: FieldRef<"Subject", 'String'>
    readonly created_at: FieldRef<"Subject", 'DateTime'>
    readonly updated_at: FieldRef<"Subject", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subject findUnique
   */
  export type SubjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where: SubjectWhereUniqueInput
  }

  /**
   * Subject findUniqueOrThrow
   */
  export type SubjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where: SubjectWhereUniqueInput
  }

  /**
   * Subject findFirst
   */
  export type SubjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subjects.
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subjects.
     */
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * Subject findFirstOrThrow
   */
  export type SubjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subjects.
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subjects.
     */
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * Subject findMany
   */
  export type SubjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subjects to fetch.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subjects.
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * Subject create
   */
  export type SubjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Subject.
     */
    data: XOR<SubjectCreateInput, SubjectUncheckedCreateInput>
  }

  /**
   * Subject createMany
   */
  export type SubjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subjects.
     */
    data: SubjectCreateManyInput | SubjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subject createManyAndReturn
   */
  export type SubjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * The data used to create many Subjects.
     */
    data: SubjectCreateManyInput | SubjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subject update
   */
  export type SubjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Subject.
     */
    data: XOR<SubjectUpdateInput, SubjectUncheckedUpdateInput>
    /**
     * Choose, which Subject to update.
     */
    where: SubjectWhereUniqueInput
  }

  /**
   * Subject updateMany
   */
  export type SubjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subjects.
     */
    data: XOR<SubjectUpdateManyMutationInput, SubjectUncheckedUpdateManyInput>
    /**
     * Filter which Subjects to update
     */
    where?: SubjectWhereInput
    /**
     * Limit how many Subjects to update.
     */
    limit?: number
  }

  /**
   * Subject updateManyAndReturn
   */
  export type SubjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * The data used to update Subjects.
     */
    data: XOR<SubjectUpdateManyMutationInput, SubjectUncheckedUpdateManyInput>
    /**
     * Filter which Subjects to update
     */
    where?: SubjectWhereInput
    /**
     * Limit how many Subjects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subject upsert
   */
  export type SubjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Subject to update in case it exists.
     */
    where: SubjectWhereUniqueInput
    /**
     * In case the Subject found by the `where` argument doesn't exist, create a new Subject with this data.
     */
    create: XOR<SubjectCreateInput, SubjectUncheckedCreateInput>
    /**
     * In case the Subject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubjectUpdateInput, SubjectUncheckedUpdateInput>
  }

  /**
   * Subject delete
   */
  export type SubjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter which Subject to delete.
     */
    where: SubjectWhereUniqueInput
  }

  /**
   * Subject deleteMany
   */
  export type SubjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subjects to delete
     */
    where?: SubjectWhereInput
    /**
     * Limit how many Subjects to delete.
     */
    limit?: number
  }

  /**
   * Subject.class
   */
  export type Subject$classArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Class
     */
    select?: ClassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Class
     */
    omit?: ClassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassInclude<ExtArgs> | null
    where?: ClassWhereInput
  }

  /**
   * Subject without action
   */
  export type SubjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
  }


  /**
   * Model Grade
   */

  export type AggregateGrade = {
    _count: GradeCountAggregateOutputType | null
    _avg: GradeAvgAggregateOutputType | null
    _sum: GradeSumAggregateOutputType | null
    _min: GradeMinAggregateOutputType | null
    _max: GradeMaxAggregateOutputType | null
  }

  export type GradeAvgAggregateOutputType = {
    id: number | null
    score: number | null
  }

  export type GradeSumAggregateOutputType = {
    id: number | null
    score: number | null
  }

  export type GradeMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    branch_uuid: string | null
    score: number | null
    grade: string | null
    remark: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type GradeMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    branch_uuid: string | null
    score: number | null
    grade: string | null
    remark: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type GradeCountAggregateOutputType = {
    id: number
    uuid: number
    branch_uuid: number
    score: number
    grade: number
    remark: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type GradeAvgAggregateInputType = {
    id?: true
    score?: true
  }

  export type GradeSumAggregateInputType = {
    id?: true
    score?: true
  }

  export type GradeMinAggregateInputType = {
    id?: true
    uuid?: true
    branch_uuid?: true
    score?: true
    grade?: true
    remark?: true
    created_at?: true
    updated_at?: true
  }

  export type GradeMaxAggregateInputType = {
    id?: true
    uuid?: true
    branch_uuid?: true
    score?: true
    grade?: true
    remark?: true
    created_at?: true
    updated_at?: true
  }

  export type GradeCountAggregateInputType = {
    id?: true
    uuid?: true
    branch_uuid?: true
    score?: true
    grade?: true
    remark?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type GradeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Grade to aggregate.
     */
    where?: GradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Grades to fetch.
     */
    orderBy?: GradeOrderByWithRelationInput | GradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Grades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Grades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Grades
    **/
    _count?: true | GradeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GradeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GradeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GradeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GradeMaxAggregateInputType
  }

  export type GetGradeAggregateType<T extends GradeAggregateArgs> = {
        [P in keyof T & keyof AggregateGrade]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGrade[P]>
      : GetScalarType<T[P], AggregateGrade[P]>
  }




  export type GradeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GradeWhereInput
    orderBy?: GradeOrderByWithAggregationInput | GradeOrderByWithAggregationInput[]
    by: GradeScalarFieldEnum[] | GradeScalarFieldEnum
    having?: GradeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GradeCountAggregateInputType | true
    _avg?: GradeAvgAggregateInputType
    _sum?: GradeSumAggregateInputType
    _min?: GradeMinAggregateInputType
    _max?: GradeMaxAggregateInputType
  }

  export type GradeGroupByOutputType = {
    id: number
    uuid: string
    branch_uuid: string
    score: number
    grade: string
    remark: string
    created_at: Date
    updated_at: Date
    _count: GradeCountAggregateOutputType | null
    _avg: GradeAvgAggregateOutputType | null
    _sum: GradeSumAggregateOutputType | null
    _min: GradeMinAggregateOutputType | null
    _max: GradeMaxAggregateOutputType | null
  }

  type GetGradeGroupByPayload<T extends GradeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GradeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GradeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GradeGroupByOutputType[P]>
            : GetScalarType<T[P], GradeGroupByOutputType[P]>
        }
      >
    >


  export type GradeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    branch_uuid?: boolean
    score?: boolean
    grade?: boolean
    remark?: boolean
    created_at?: boolean
    updated_at?: boolean
    branch?: boolean | Grade$branchArgs<ExtArgs>
  }, ExtArgs["result"]["grade"]>

  export type GradeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    branch_uuid?: boolean
    score?: boolean
    grade?: boolean
    remark?: boolean
    created_at?: boolean
    updated_at?: boolean
    branch?: boolean | Grade$branchArgs<ExtArgs>
  }, ExtArgs["result"]["grade"]>

  export type GradeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    branch_uuid?: boolean
    score?: boolean
    grade?: boolean
    remark?: boolean
    created_at?: boolean
    updated_at?: boolean
    branch?: boolean | Grade$branchArgs<ExtArgs>
  }, ExtArgs["result"]["grade"]>

  export type GradeSelectScalar = {
    id?: boolean
    uuid?: boolean
    branch_uuid?: boolean
    score?: boolean
    grade?: boolean
    remark?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type GradeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "branch_uuid" | "score" | "grade" | "remark" | "created_at" | "updated_at", ExtArgs["result"]["grade"]>
  export type GradeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    branch?: boolean | Grade$branchArgs<ExtArgs>
  }
  export type GradeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    branch?: boolean | Grade$branchArgs<ExtArgs>
  }
  export type GradeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    branch?: boolean | Grade$branchArgs<ExtArgs>
  }

  export type $GradePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Grade"
    objects: {
      branch: Prisma.$BranchPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      branch_uuid: string
      score: number
      grade: string
      remark: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["grade"]>
    composites: {}
  }

  type GradeGetPayload<S extends boolean | null | undefined | GradeDefaultArgs> = $Result.GetResult<Prisma.$GradePayload, S>

  type GradeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GradeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GradeCountAggregateInputType | true
    }

  export interface GradeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Grade'], meta: { name: 'Grade' } }
    /**
     * Find zero or one Grade that matches the filter.
     * @param {GradeFindUniqueArgs} args - Arguments to find a Grade
     * @example
     * // Get one Grade
     * const grade = await prisma.grade.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GradeFindUniqueArgs>(args: SelectSubset<T, GradeFindUniqueArgs<ExtArgs>>): Prisma__GradeClient<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Grade that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GradeFindUniqueOrThrowArgs} args - Arguments to find a Grade
     * @example
     * // Get one Grade
     * const grade = await prisma.grade.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GradeFindUniqueOrThrowArgs>(args: SelectSubset<T, GradeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GradeClient<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Grade that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradeFindFirstArgs} args - Arguments to find a Grade
     * @example
     * // Get one Grade
     * const grade = await prisma.grade.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GradeFindFirstArgs>(args?: SelectSubset<T, GradeFindFirstArgs<ExtArgs>>): Prisma__GradeClient<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Grade that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradeFindFirstOrThrowArgs} args - Arguments to find a Grade
     * @example
     * // Get one Grade
     * const grade = await prisma.grade.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GradeFindFirstOrThrowArgs>(args?: SelectSubset<T, GradeFindFirstOrThrowArgs<ExtArgs>>): Prisma__GradeClient<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Grades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Grades
     * const grades = await prisma.grade.findMany()
     * 
     * // Get first 10 Grades
     * const grades = await prisma.grade.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gradeWithIdOnly = await prisma.grade.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GradeFindManyArgs>(args?: SelectSubset<T, GradeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Grade.
     * @param {GradeCreateArgs} args - Arguments to create a Grade.
     * @example
     * // Create one Grade
     * const Grade = await prisma.grade.create({
     *   data: {
     *     // ... data to create a Grade
     *   }
     * })
     * 
     */
    create<T extends GradeCreateArgs>(args: SelectSubset<T, GradeCreateArgs<ExtArgs>>): Prisma__GradeClient<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Grades.
     * @param {GradeCreateManyArgs} args - Arguments to create many Grades.
     * @example
     * // Create many Grades
     * const grade = await prisma.grade.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GradeCreateManyArgs>(args?: SelectSubset<T, GradeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Grades and returns the data saved in the database.
     * @param {GradeCreateManyAndReturnArgs} args - Arguments to create many Grades.
     * @example
     * // Create many Grades
     * const grade = await prisma.grade.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Grades and only return the `id`
     * const gradeWithIdOnly = await prisma.grade.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GradeCreateManyAndReturnArgs>(args?: SelectSubset<T, GradeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Grade.
     * @param {GradeDeleteArgs} args - Arguments to delete one Grade.
     * @example
     * // Delete one Grade
     * const Grade = await prisma.grade.delete({
     *   where: {
     *     // ... filter to delete one Grade
     *   }
     * })
     * 
     */
    delete<T extends GradeDeleteArgs>(args: SelectSubset<T, GradeDeleteArgs<ExtArgs>>): Prisma__GradeClient<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Grade.
     * @param {GradeUpdateArgs} args - Arguments to update one Grade.
     * @example
     * // Update one Grade
     * const grade = await prisma.grade.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GradeUpdateArgs>(args: SelectSubset<T, GradeUpdateArgs<ExtArgs>>): Prisma__GradeClient<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Grades.
     * @param {GradeDeleteManyArgs} args - Arguments to filter Grades to delete.
     * @example
     * // Delete a few Grades
     * const { count } = await prisma.grade.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GradeDeleteManyArgs>(args?: SelectSubset<T, GradeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Grades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Grades
     * const grade = await prisma.grade.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GradeUpdateManyArgs>(args: SelectSubset<T, GradeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Grades and returns the data updated in the database.
     * @param {GradeUpdateManyAndReturnArgs} args - Arguments to update many Grades.
     * @example
     * // Update many Grades
     * const grade = await prisma.grade.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Grades and only return the `id`
     * const gradeWithIdOnly = await prisma.grade.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GradeUpdateManyAndReturnArgs>(args: SelectSubset<T, GradeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Grade.
     * @param {GradeUpsertArgs} args - Arguments to update or create a Grade.
     * @example
     * // Update or create a Grade
     * const grade = await prisma.grade.upsert({
     *   create: {
     *     // ... data to create a Grade
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Grade we want to update
     *   }
     * })
     */
    upsert<T extends GradeUpsertArgs>(args: SelectSubset<T, GradeUpsertArgs<ExtArgs>>): Prisma__GradeClient<$Result.GetResult<Prisma.$GradePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Grades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradeCountArgs} args - Arguments to filter Grades to count.
     * @example
     * // Count the number of Grades
     * const count = await prisma.grade.count({
     *   where: {
     *     // ... the filter for the Grades we want to count
     *   }
     * })
    **/
    count<T extends GradeCountArgs>(
      args?: Subset<T, GradeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GradeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Grade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GradeAggregateArgs>(args: Subset<T, GradeAggregateArgs>): Prisma.PrismaPromise<GetGradeAggregateType<T>>

    /**
     * Group by Grade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GradeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GradeGroupByArgs['orderBy'] }
        : { orderBy?: GradeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GradeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGradeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Grade model
   */
  readonly fields: GradeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Grade.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GradeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    branch<T extends Grade$branchArgs<ExtArgs> = {}>(args?: Subset<T, Grade$branchArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Grade model
   */
  interface GradeFieldRefs {
    readonly id: FieldRef<"Grade", 'Int'>
    readonly uuid: FieldRef<"Grade", 'String'>
    readonly branch_uuid: FieldRef<"Grade", 'String'>
    readonly score: FieldRef<"Grade", 'Float'>
    readonly grade: FieldRef<"Grade", 'String'>
    readonly remark: FieldRef<"Grade", 'String'>
    readonly created_at: FieldRef<"Grade", 'DateTime'>
    readonly updated_at: FieldRef<"Grade", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Grade findUnique
   */
  export type GradeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    /**
     * Filter, which Grade to fetch.
     */
    where: GradeWhereUniqueInput
  }

  /**
   * Grade findUniqueOrThrow
   */
  export type GradeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    /**
     * Filter, which Grade to fetch.
     */
    where: GradeWhereUniqueInput
  }

  /**
   * Grade findFirst
   */
  export type GradeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    /**
     * Filter, which Grade to fetch.
     */
    where?: GradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Grades to fetch.
     */
    orderBy?: GradeOrderByWithRelationInput | GradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Grades.
     */
    cursor?: GradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Grades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Grades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Grades.
     */
    distinct?: GradeScalarFieldEnum | GradeScalarFieldEnum[]
  }

  /**
   * Grade findFirstOrThrow
   */
  export type GradeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    /**
     * Filter, which Grade to fetch.
     */
    where?: GradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Grades to fetch.
     */
    orderBy?: GradeOrderByWithRelationInput | GradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Grades.
     */
    cursor?: GradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Grades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Grades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Grades.
     */
    distinct?: GradeScalarFieldEnum | GradeScalarFieldEnum[]
  }

  /**
   * Grade findMany
   */
  export type GradeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    /**
     * Filter, which Grades to fetch.
     */
    where?: GradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Grades to fetch.
     */
    orderBy?: GradeOrderByWithRelationInput | GradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Grades.
     */
    cursor?: GradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Grades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Grades.
     */
    skip?: number
    distinct?: GradeScalarFieldEnum | GradeScalarFieldEnum[]
  }

  /**
   * Grade create
   */
  export type GradeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    /**
     * The data needed to create a Grade.
     */
    data: XOR<GradeCreateInput, GradeUncheckedCreateInput>
  }

  /**
   * Grade createMany
   */
  export type GradeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Grades.
     */
    data: GradeCreateManyInput | GradeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Grade createManyAndReturn
   */
  export type GradeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * The data used to create many Grades.
     */
    data: GradeCreateManyInput | GradeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Grade update
   */
  export type GradeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    /**
     * The data needed to update a Grade.
     */
    data: XOR<GradeUpdateInput, GradeUncheckedUpdateInput>
    /**
     * Choose, which Grade to update.
     */
    where: GradeWhereUniqueInput
  }

  /**
   * Grade updateMany
   */
  export type GradeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Grades.
     */
    data: XOR<GradeUpdateManyMutationInput, GradeUncheckedUpdateManyInput>
    /**
     * Filter which Grades to update
     */
    where?: GradeWhereInput
    /**
     * Limit how many Grades to update.
     */
    limit?: number
  }

  /**
   * Grade updateManyAndReturn
   */
  export type GradeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * The data used to update Grades.
     */
    data: XOR<GradeUpdateManyMutationInput, GradeUncheckedUpdateManyInput>
    /**
     * Filter which Grades to update
     */
    where?: GradeWhereInput
    /**
     * Limit how many Grades to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Grade upsert
   */
  export type GradeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    /**
     * The filter to search for the Grade to update in case it exists.
     */
    where: GradeWhereUniqueInput
    /**
     * In case the Grade found by the `where` argument doesn't exist, create a new Grade with this data.
     */
    create: XOR<GradeCreateInput, GradeUncheckedCreateInput>
    /**
     * In case the Grade was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GradeUpdateInput, GradeUncheckedUpdateInput>
  }

  /**
   * Grade delete
   */
  export type GradeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
    /**
     * Filter which Grade to delete.
     */
    where: GradeWhereUniqueInput
  }

  /**
   * Grade deleteMany
   */
  export type GradeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Grades to delete
     */
    where?: GradeWhereInput
    /**
     * Limit how many Grades to delete.
     */
    limit?: number
  }

  /**
   * Grade.branch
   */
  export type Grade$branchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    where?: BranchWhereInput
  }

  /**
   * Grade without action
   */
  export type GradeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grade
     */
    select?: GradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grade
     */
    omit?: GradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradeInclude<ExtArgs> | null
  }


  /**
   * Model Result
   */

  export type AggregateResult = {
    _count: ResultCountAggregateOutputType | null
    _avg: ResultAvgAggregateOutputType | null
    _sum: ResultSumAggregateOutputType | null
    _min: ResultMinAggregateOutputType | null
    _max: ResultMaxAggregateOutputType | null
  }

  export type ResultAvgAggregateOutputType = {
    id: number | null
  }

  export type ResultSumAggregateOutputType = {
    id: number | null
  }

  export type ResultMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    student_uuid: string | null
    class_name: string | null
    grade: string | null
    remark: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ResultMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    student_uuid: string | null
    class_name: string | null
    grade: string | null
    remark: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ResultCountAggregateOutputType = {
    id: number
    uuid: number
    student_uuid: number
    class_name: number
    grade: number
    remark: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ResultAvgAggregateInputType = {
    id?: true
  }

  export type ResultSumAggregateInputType = {
    id?: true
  }

  export type ResultMinAggregateInputType = {
    id?: true
    uuid?: true
    student_uuid?: true
    class_name?: true
    grade?: true
    remark?: true
    created_at?: true
    updated_at?: true
  }

  export type ResultMaxAggregateInputType = {
    id?: true
    uuid?: true
    student_uuid?: true
    class_name?: true
    grade?: true
    remark?: true
    created_at?: true
    updated_at?: true
  }

  export type ResultCountAggregateInputType = {
    id?: true
    uuid?: true
    student_uuid?: true
    class_name?: true
    grade?: true
    remark?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Result to aggregate.
     */
    where?: ResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Results to fetch.
     */
    orderBy?: ResultOrderByWithRelationInput | ResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Results from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Results.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Results
    **/
    _count?: true | ResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResultAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResultSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResultMaxAggregateInputType
  }

  export type GetResultAggregateType<T extends ResultAggregateArgs> = {
        [P in keyof T & keyof AggregateResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResult[P]>
      : GetScalarType<T[P], AggregateResult[P]>
  }




  export type ResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResultWhereInput
    orderBy?: ResultOrderByWithAggregationInput | ResultOrderByWithAggregationInput[]
    by: ResultScalarFieldEnum[] | ResultScalarFieldEnum
    having?: ResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResultCountAggregateInputType | true
    _avg?: ResultAvgAggregateInputType
    _sum?: ResultSumAggregateInputType
    _min?: ResultMinAggregateInputType
    _max?: ResultMaxAggregateInputType
  }

  export type ResultGroupByOutputType = {
    id: number
    uuid: string
    student_uuid: string
    class_name: string
    grade: string
    remark: string
    created_at: Date
    updated_at: Date
    _count: ResultCountAggregateOutputType | null
    _avg: ResultAvgAggregateOutputType | null
    _sum: ResultSumAggregateOutputType | null
    _min: ResultMinAggregateOutputType | null
    _max: ResultMaxAggregateOutputType | null
  }

  type GetResultGroupByPayload<T extends ResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResultGroupByOutputType[P]>
            : GetScalarType<T[P], ResultGroupByOutputType[P]>
        }
      >
    >


  export type ResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    student_uuid?: boolean
    class_name?: boolean
    grade?: boolean
    remark?: boolean
    created_at?: boolean
    updated_at?: boolean
    student?: boolean | Result$studentArgs<ExtArgs>
    assessments?: boolean | Result$assessmentsArgs<ExtArgs>
    _count?: boolean | ResultCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["result"]>

  export type ResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    student_uuid?: boolean
    class_name?: boolean
    grade?: boolean
    remark?: boolean
    created_at?: boolean
    updated_at?: boolean
    student?: boolean | Result$studentArgs<ExtArgs>
  }, ExtArgs["result"]["result"]>

  export type ResultSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    student_uuid?: boolean
    class_name?: boolean
    grade?: boolean
    remark?: boolean
    created_at?: boolean
    updated_at?: boolean
    student?: boolean | Result$studentArgs<ExtArgs>
  }, ExtArgs["result"]["result"]>

  export type ResultSelectScalar = {
    id?: boolean
    uuid?: boolean
    student_uuid?: boolean
    class_name?: boolean
    grade?: boolean
    remark?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ResultOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "student_uuid" | "class_name" | "grade" | "remark" | "created_at" | "updated_at", ExtArgs["result"]["result"]>
  export type ResultInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | Result$studentArgs<ExtArgs>
    assessments?: boolean | Result$assessmentsArgs<ExtArgs>
    _count?: boolean | ResultCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ResultIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | Result$studentArgs<ExtArgs>
  }
  export type ResultIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | Result$studentArgs<ExtArgs>
  }

  export type $ResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Result"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs> | null
      assessments: Prisma.$AssessmentsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      student_uuid: string
      class_name: string
      grade: string
      remark: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["result"]>
    composites: {}
  }

  type ResultGetPayload<S extends boolean | null | undefined | ResultDefaultArgs> = $Result.GetResult<Prisma.$ResultPayload, S>

  type ResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResultCountAggregateInputType | true
    }

  export interface ResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Result'], meta: { name: 'Result' } }
    /**
     * Find zero or one Result that matches the filter.
     * @param {ResultFindUniqueArgs} args - Arguments to find a Result
     * @example
     * // Get one Result
     * const result = await prisma.result.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResultFindUniqueArgs>(args: SelectSubset<T, ResultFindUniqueArgs<ExtArgs>>): Prisma__ResultClient<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Result that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResultFindUniqueOrThrowArgs} args - Arguments to find a Result
     * @example
     * // Get one Result
     * const result = await prisma.result.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResultFindUniqueOrThrowArgs>(args: SelectSubset<T, ResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResultClient<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Result that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResultFindFirstArgs} args - Arguments to find a Result
     * @example
     * // Get one Result
     * const result = await prisma.result.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResultFindFirstArgs>(args?: SelectSubset<T, ResultFindFirstArgs<ExtArgs>>): Prisma__ResultClient<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Result that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResultFindFirstOrThrowArgs} args - Arguments to find a Result
     * @example
     * // Get one Result
     * const result = await prisma.result.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResultFindFirstOrThrowArgs>(args?: SelectSubset<T, ResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResultClient<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Results that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Results
     * const results = await prisma.result.findMany()
     * 
     * // Get first 10 Results
     * const results = await prisma.result.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resultWithIdOnly = await prisma.result.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResultFindManyArgs>(args?: SelectSubset<T, ResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Result.
     * @param {ResultCreateArgs} args - Arguments to create a Result.
     * @example
     * // Create one Result
     * const Result = await prisma.result.create({
     *   data: {
     *     // ... data to create a Result
     *   }
     * })
     * 
     */
    create<T extends ResultCreateArgs>(args: SelectSubset<T, ResultCreateArgs<ExtArgs>>): Prisma__ResultClient<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Results.
     * @param {ResultCreateManyArgs} args - Arguments to create many Results.
     * @example
     * // Create many Results
     * const result = await prisma.result.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResultCreateManyArgs>(args?: SelectSubset<T, ResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Results and returns the data saved in the database.
     * @param {ResultCreateManyAndReturnArgs} args - Arguments to create many Results.
     * @example
     * // Create many Results
     * const result = await prisma.result.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Results and only return the `id`
     * const resultWithIdOnly = await prisma.result.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResultCreateManyAndReturnArgs>(args?: SelectSubset<T, ResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Result.
     * @param {ResultDeleteArgs} args - Arguments to delete one Result.
     * @example
     * // Delete one Result
     * const Result = await prisma.result.delete({
     *   where: {
     *     // ... filter to delete one Result
     *   }
     * })
     * 
     */
    delete<T extends ResultDeleteArgs>(args: SelectSubset<T, ResultDeleteArgs<ExtArgs>>): Prisma__ResultClient<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Result.
     * @param {ResultUpdateArgs} args - Arguments to update one Result.
     * @example
     * // Update one Result
     * const result = await prisma.result.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResultUpdateArgs>(args: SelectSubset<T, ResultUpdateArgs<ExtArgs>>): Prisma__ResultClient<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Results.
     * @param {ResultDeleteManyArgs} args - Arguments to filter Results to delete.
     * @example
     * // Delete a few Results
     * const { count } = await prisma.result.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResultDeleteManyArgs>(args?: SelectSubset<T, ResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Results.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Results
     * const result = await prisma.result.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResultUpdateManyArgs>(args: SelectSubset<T, ResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Results and returns the data updated in the database.
     * @param {ResultUpdateManyAndReturnArgs} args - Arguments to update many Results.
     * @example
     * // Update many Results
     * const result = await prisma.result.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Results and only return the `id`
     * const resultWithIdOnly = await prisma.result.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResultUpdateManyAndReturnArgs>(args: SelectSubset<T, ResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Result.
     * @param {ResultUpsertArgs} args - Arguments to update or create a Result.
     * @example
     * // Update or create a Result
     * const result = await prisma.result.upsert({
     *   create: {
     *     // ... data to create a Result
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Result we want to update
     *   }
     * })
     */
    upsert<T extends ResultUpsertArgs>(args: SelectSubset<T, ResultUpsertArgs<ExtArgs>>): Prisma__ResultClient<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Results.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResultCountArgs} args - Arguments to filter Results to count.
     * @example
     * // Count the number of Results
     * const count = await prisma.result.count({
     *   where: {
     *     // ... the filter for the Results we want to count
     *   }
     * })
    **/
    count<T extends ResultCountArgs>(
      args?: Subset<T, ResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Result.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResultAggregateArgs>(args: Subset<T, ResultAggregateArgs>): Prisma.PrismaPromise<GetResultAggregateType<T>>

    /**
     * Group by Result.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResultGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResultGroupByArgs['orderBy'] }
        : { orderBy?: ResultGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Result model
   */
  readonly fields: ResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Result.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends Result$studentArgs<ExtArgs> = {}>(args?: Subset<T, Result$studentArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    assessments<T extends Result$assessmentsArgs<ExtArgs> = {}>(args?: Subset<T, Result$assessmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Result model
   */
  interface ResultFieldRefs {
    readonly id: FieldRef<"Result", 'Int'>
    readonly uuid: FieldRef<"Result", 'String'>
    readonly student_uuid: FieldRef<"Result", 'String'>
    readonly class_name: FieldRef<"Result", 'String'>
    readonly grade: FieldRef<"Result", 'String'>
    readonly remark: FieldRef<"Result", 'String'>
    readonly created_at: FieldRef<"Result", 'DateTime'>
    readonly updated_at: FieldRef<"Result", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Result findUnique
   */
  export type ResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    /**
     * Filter, which Result to fetch.
     */
    where: ResultWhereUniqueInput
  }

  /**
   * Result findUniqueOrThrow
   */
  export type ResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    /**
     * Filter, which Result to fetch.
     */
    where: ResultWhereUniqueInput
  }

  /**
   * Result findFirst
   */
  export type ResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    /**
     * Filter, which Result to fetch.
     */
    where?: ResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Results to fetch.
     */
    orderBy?: ResultOrderByWithRelationInput | ResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Results.
     */
    cursor?: ResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Results from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Results.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Results.
     */
    distinct?: ResultScalarFieldEnum | ResultScalarFieldEnum[]
  }

  /**
   * Result findFirstOrThrow
   */
  export type ResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    /**
     * Filter, which Result to fetch.
     */
    where?: ResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Results to fetch.
     */
    orderBy?: ResultOrderByWithRelationInput | ResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Results.
     */
    cursor?: ResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Results from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Results.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Results.
     */
    distinct?: ResultScalarFieldEnum | ResultScalarFieldEnum[]
  }

  /**
   * Result findMany
   */
  export type ResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    /**
     * Filter, which Results to fetch.
     */
    where?: ResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Results to fetch.
     */
    orderBy?: ResultOrderByWithRelationInput | ResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Results.
     */
    cursor?: ResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Results from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Results.
     */
    skip?: number
    distinct?: ResultScalarFieldEnum | ResultScalarFieldEnum[]
  }

  /**
   * Result create
   */
  export type ResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    /**
     * The data needed to create a Result.
     */
    data: XOR<ResultCreateInput, ResultUncheckedCreateInput>
  }

  /**
   * Result createMany
   */
  export type ResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Results.
     */
    data: ResultCreateManyInput | ResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Result createManyAndReturn
   */
  export type ResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * The data used to create many Results.
     */
    data: ResultCreateManyInput | ResultCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Result update
   */
  export type ResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    /**
     * The data needed to update a Result.
     */
    data: XOR<ResultUpdateInput, ResultUncheckedUpdateInput>
    /**
     * Choose, which Result to update.
     */
    where: ResultWhereUniqueInput
  }

  /**
   * Result updateMany
   */
  export type ResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Results.
     */
    data: XOR<ResultUpdateManyMutationInput, ResultUncheckedUpdateManyInput>
    /**
     * Filter which Results to update
     */
    where?: ResultWhereInput
    /**
     * Limit how many Results to update.
     */
    limit?: number
  }

  /**
   * Result updateManyAndReturn
   */
  export type ResultUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * The data used to update Results.
     */
    data: XOR<ResultUpdateManyMutationInput, ResultUncheckedUpdateManyInput>
    /**
     * Filter which Results to update
     */
    where?: ResultWhereInput
    /**
     * Limit how many Results to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Result upsert
   */
  export type ResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    /**
     * The filter to search for the Result to update in case it exists.
     */
    where: ResultWhereUniqueInput
    /**
     * In case the Result found by the `where` argument doesn't exist, create a new Result with this data.
     */
    create: XOR<ResultCreateInput, ResultUncheckedCreateInput>
    /**
     * In case the Result was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResultUpdateInput, ResultUncheckedUpdateInput>
  }

  /**
   * Result delete
   */
  export type ResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    /**
     * Filter which Result to delete.
     */
    where: ResultWhereUniqueInput
  }

  /**
   * Result deleteMany
   */
  export type ResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Results to delete
     */
    where?: ResultWhereInput
    /**
     * Limit how many Results to delete.
     */
    limit?: number
  }

  /**
   * Result.student
   */
  export type Result$studentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
  }

  /**
   * Result.assessments
   */
  export type Result$assessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    where?: AssessmentsWhereInput
    orderBy?: AssessmentsOrderByWithRelationInput | AssessmentsOrderByWithRelationInput[]
    cursor?: AssessmentsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssessmentsScalarFieldEnum | AssessmentsScalarFieldEnum[]
  }

  /**
   * Result without action
   */
  export type ResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
  }


  /**
   * Model Assessments
   */

  export type AggregateAssessments = {
    _count: AssessmentsCountAggregateOutputType | null
    _avg: AssessmentsAvgAggregateOutputType | null
    _sum: AssessmentsSumAggregateOutputType | null
    _min: AssessmentsMinAggregateOutputType | null
    _max: AssessmentsMaxAggregateOutputType | null
  }

  export type AssessmentsAvgAggregateOutputType = {
    id: number | null
    assignment: number | null
    assesment: number | null
    examination: number | null
    overall: number | null
  }

  export type AssessmentsSumAggregateOutputType = {
    id: number | null
    assignment: number | null
    assesment: number | null
    examination: number | null
    overall: number | null
  }

  export type AssessmentsMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    result_uuid: string | null
    subject: string | null
    assignment: number | null
    assesment: number | null
    examination: number | null
    overall: number | null
    grade: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AssessmentsMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    result_uuid: string | null
    subject: string | null
    assignment: number | null
    assesment: number | null
    examination: number | null
    overall: number | null
    grade: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AssessmentsCountAggregateOutputType = {
    id: number
    uuid: number
    result_uuid: number
    subject: number
    assignment: number
    assesment: number
    examination: number
    overall: number
    grade: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type AssessmentsAvgAggregateInputType = {
    id?: true
    assignment?: true
    assesment?: true
    examination?: true
    overall?: true
  }

  export type AssessmentsSumAggregateInputType = {
    id?: true
    assignment?: true
    assesment?: true
    examination?: true
    overall?: true
  }

  export type AssessmentsMinAggregateInputType = {
    id?: true
    uuid?: true
    result_uuid?: true
    subject?: true
    assignment?: true
    assesment?: true
    examination?: true
    overall?: true
    grade?: true
    created_at?: true
    updated_at?: true
  }

  export type AssessmentsMaxAggregateInputType = {
    id?: true
    uuid?: true
    result_uuid?: true
    subject?: true
    assignment?: true
    assesment?: true
    examination?: true
    overall?: true
    grade?: true
    created_at?: true
    updated_at?: true
  }

  export type AssessmentsCountAggregateInputType = {
    id?: true
    uuid?: true
    result_uuid?: true
    subject?: true
    assignment?: true
    assesment?: true
    examination?: true
    overall?: true
    grade?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type AssessmentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assessments to aggregate.
     */
    where?: AssessmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assessments to fetch.
     */
    orderBy?: AssessmentsOrderByWithRelationInput | AssessmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssessmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Assessments
    **/
    _count?: true | AssessmentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssessmentsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssessmentsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssessmentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssessmentsMaxAggregateInputType
  }

  export type GetAssessmentsAggregateType<T extends AssessmentsAggregateArgs> = {
        [P in keyof T & keyof AggregateAssessments]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssessments[P]>
      : GetScalarType<T[P], AggregateAssessments[P]>
  }




  export type AssessmentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssessmentsWhereInput
    orderBy?: AssessmentsOrderByWithAggregationInput | AssessmentsOrderByWithAggregationInput[]
    by: AssessmentsScalarFieldEnum[] | AssessmentsScalarFieldEnum
    having?: AssessmentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssessmentsCountAggregateInputType | true
    _avg?: AssessmentsAvgAggregateInputType
    _sum?: AssessmentsSumAggregateInputType
    _min?: AssessmentsMinAggregateInputType
    _max?: AssessmentsMaxAggregateInputType
  }

  export type AssessmentsGroupByOutputType = {
    id: number
    uuid: string
    result_uuid: string
    subject: string
    assignment: number
    assesment: number
    examination: number
    overall: number
    grade: string
    created_at: Date
    updated_at: Date
    _count: AssessmentsCountAggregateOutputType | null
    _avg: AssessmentsAvgAggregateOutputType | null
    _sum: AssessmentsSumAggregateOutputType | null
    _min: AssessmentsMinAggregateOutputType | null
    _max: AssessmentsMaxAggregateOutputType | null
  }

  type GetAssessmentsGroupByPayload<T extends AssessmentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssessmentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssessmentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssessmentsGroupByOutputType[P]>
            : GetScalarType<T[P], AssessmentsGroupByOutputType[P]>
        }
      >
    >


  export type AssessmentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    result_uuid?: boolean
    subject?: boolean
    assignment?: boolean
    assesment?: boolean
    examination?: boolean
    overall?: boolean
    grade?: boolean
    created_at?: boolean
    updated_at?: boolean
    result?: boolean | Assessments$resultArgs<ExtArgs>
  }, ExtArgs["result"]["assessments"]>

  export type AssessmentsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    result_uuid?: boolean
    subject?: boolean
    assignment?: boolean
    assesment?: boolean
    examination?: boolean
    overall?: boolean
    grade?: boolean
    created_at?: boolean
    updated_at?: boolean
    result?: boolean | Assessments$resultArgs<ExtArgs>
  }, ExtArgs["result"]["assessments"]>

  export type AssessmentsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    result_uuid?: boolean
    subject?: boolean
    assignment?: boolean
    assesment?: boolean
    examination?: boolean
    overall?: boolean
    grade?: boolean
    created_at?: boolean
    updated_at?: boolean
    result?: boolean | Assessments$resultArgs<ExtArgs>
  }, ExtArgs["result"]["assessments"]>

  export type AssessmentsSelectScalar = {
    id?: boolean
    uuid?: boolean
    result_uuid?: boolean
    subject?: boolean
    assignment?: boolean
    assesment?: boolean
    examination?: boolean
    overall?: boolean
    grade?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type AssessmentsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "result_uuid" | "subject" | "assignment" | "assesment" | "examination" | "overall" | "grade" | "created_at" | "updated_at", ExtArgs["result"]["assessments"]>
  export type AssessmentsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    result?: boolean | Assessments$resultArgs<ExtArgs>
  }
  export type AssessmentsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    result?: boolean | Assessments$resultArgs<ExtArgs>
  }
  export type AssessmentsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    result?: boolean | Assessments$resultArgs<ExtArgs>
  }

  export type $AssessmentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Assessments"
    objects: {
      result: Prisma.$ResultPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      result_uuid: string
      subject: string
      assignment: number
      assesment: number
      examination: number
      overall: number
      grade: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["assessments"]>
    composites: {}
  }

  type AssessmentsGetPayload<S extends boolean | null | undefined | AssessmentsDefaultArgs> = $Result.GetResult<Prisma.$AssessmentsPayload, S>

  type AssessmentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssessmentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssessmentsCountAggregateInputType | true
    }

  export interface AssessmentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Assessments'], meta: { name: 'Assessments' } }
    /**
     * Find zero or one Assessments that matches the filter.
     * @param {AssessmentsFindUniqueArgs} args - Arguments to find a Assessments
     * @example
     * // Get one Assessments
     * const assessments = await prisma.assessments.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssessmentsFindUniqueArgs>(args: SelectSubset<T, AssessmentsFindUniqueArgs<ExtArgs>>): Prisma__AssessmentsClient<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Assessments that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssessmentsFindUniqueOrThrowArgs} args - Arguments to find a Assessments
     * @example
     * // Get one Assessments
     * const assessments = await prisma.assessments.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssessmentsFindUniqueOrThrowArgs>(args: SelectSubset<T, AssessmentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssessmentsClient<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Assessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentsFindFirstArgs} args - Arguments to find a Assessments
     * @example
     * // Get one Assessments
     * const assessments = await prisma.assessments.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssessmentsFindFirstArgs>(args?: SelectSubset<T, AssessmentsFindFirstArgs<ExtArgs>>): Prisma__AssessmentsClient<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Assessments that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentsFindFirstOrThrowArgs} args - Arguments to find a Assessments
     * @example
     * // Get one Assessments
     * const assessments = await prisma.assessments.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssessmentsFindFirstOrThrowArgs>(args?: SelectSubset<T, AssessmentsFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssessmentsClient<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Assessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assessments
     * const assessments = await prisma.assessments.findMany()
     * 
     * // Get first 10 Assessments
     * const assessments = await prisma.assessments.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assessmentsWithIdOnly = await prisma.assessments.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssessmentsFindManyArgs>(args?: SelectSubset<T, AssessmentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Assessments.
     * @param {AssessmentsCreateArgs} args - Arguments to create a Assessments.
     * @example
     * // Create one Assessments
     * const Assessments = await prisma.assessments.create({
     *   data: {
     *     // ... data to create a Assessments
     *   }
     * })
     * 
     */
    create<T extends AssessmentsCreateArgs>(args: SelectSubset<T, AssessmentsCreateArgs<ExtArgs>>): Prisma__AssessmentsClient<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Assessments.
     * @param {AssessmentsCreateManyArgs} args - Arguments to create many Assessments.
     * @example
     * // Create many Assessments
     * const assessments = await prisma.assessments.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssessmentsCreateManyArgs>(args?: SelectSubset<T, AssessmentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Assessments and returns the data saved in the database.
     * @param {AssessmentsCreateManyAndReturnArgs} args - Arguments to create many Assessments.
     * @example
     * // Create many Assessments
     * const assessments = await prisma.assessments.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Assessments and only return the `id`
     * const assessmentsWithIdOnly = await prisma.assessments.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssessmentsCreateManyAndReturnArgs>(args?: SelectSubset<T, AssessmentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Assessments.
     * @param {AssessmentsDeleteArgs} args - Arguments to delete one Assessments.
     * @example
     * // Delete one Assessments
     * const Assessments = await prisma.assessments.delete({
     *   where: {
     *     // ... filter to delete one Assessments
     *   }
     * })
     * 
     */
    delete<T extends AssessmentsDeleteArgs>(args: SelectSubset<T, AssessmentsDeleteArgs<ExtArgs>>): Prisma__AssessmentsClient<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Assessments.
     * @param {AssessmentsUpdateArgs} args - Arguments to update one Assessments.
     * @example
     * // Update one Assessments
     * const assessments = await prisma.assessments.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssessmentsUpdateArgs>(args: SelectSubset<T, AssessmentsUpdateArgs<ExtArgs>>): Prisma__AssessmentsClient<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Assessments.
     * @param {AssessmentsDeleteManyArgs} args - Arguments to filter Assessments to delete.
     * @example
     * // Delete a few Assessments
     * const { count } = await prisma.assessments.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssessmentsDeleteManyArgs>(args?: SelectSubset<T, AssessmentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assessments
     * const assessments = await prisma.assessments.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssessmentsUpdateManyArgs>(args: SelectSubset<T, AssessmentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assessments and returns the data updated in the database.
     * @param {AssessmentsUpdateManyAndReturnArgs} args - Arguments to update many Assessments.
     * @example
     * // Update many Assessments
     * const assessments = await prisma.assessments.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Assessments and only return the `id`
     * const assessmentsWithIdOnly = await prisma.assessments.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssessmentsUpdateManyAndReturnArgs>(args: SelectSubset<T, AssessmentsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Assessments.
     * @param {AssessmentsUpsertArgs} args - Arguments to update or create a Assessments.
     * @example
     * // Update or create a Assessments
     * const assessments = await prisma.assessments.upsert({
     *   create: {
     *     // ... data to create a Assessments
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Assessments we want to update
     *   }
     * })
     */
    upsert<T extends AssessmentsUpsertArgs>(args: SelectSubset<T, AssessmentsUpsertArgs<ExtArgs>>): Prisma__AssessmentsClient<$Result.GetResult<Prisma.$AssessmentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentsCountArgs} args - Arguments to filter Assessments to count.
     * @example
     * // Count the number of Assessments
     * const count = await prisma.assessments.count({
     *   where: {
     *     // ... the filter for the Assessments we want to count
     *   }
     * })
    **/
    count<T extends AssessmentsCountArgs>(
      args?: Subset<T, AssessmentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssessmentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssessmentsAggregateArgs>(args: Subset<T, AssessmentsAggregateArgs>): Prisma.PrismaPromise<GetAssessmentsAggregateType<T>>

    /**
     * Group by Assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessmentsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssessmentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssessmentsGroupByArgs['orderBy'] }
        : { orderBy?: AssessmentsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssessmentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssessmentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Assessments model
   */
  readonly fields: AssessmentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Assessments.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssessmentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    result<T extends Assessments$resultArgs<ExtArgs> = {}>(args?: Subset<T, Assessments$resultArgs<ExtArgs>>): Prisma__ResultClient<$Result.GetResult<Prisma.$ResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Assessments model
   */
  interface AssessmentsFieldRefs {
    readonly id: FieldRef<"Assessments", 'Int'>
    readonly uuid: FieldRef<"Assessments", 'String'>
    readonly result_uuid: FieldRef<"Assessments", 'String'>
    readonly subject: FieldRef<"Assessments", 'String'>
    readonly assignment: FieldRef<"Assessments", 'Float'>
    readonly assesment: FieldRef<"Assessments", 'Float'>
    readonly examination: FieldRef<"Assessments", 'Float'>
    readonly overall: FieldRef<"Assessments", 'Float'>
    readonly grade: FieldRef<"Assessments", 'String'>
    readonly created_at: FieldRef<"Assessments", 'DateTime'>
    readonly updated_at: FieldRef<"Assessments", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Assessments findUnique
   */
  export type AssessmentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    /**
     * Filter, which Assessments to fetch.
     */
    where: AssessmentsWhereUniqueInput
  }

  /**
   * Assessments findUniqueOrThrow
   */
  export type AssessmentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    /**
     * Filter, which Assessments to fetch.
     */
    where: AssessmentsWhereUniqueInput
  }

  /**
   * Assessments findFirst
   */
  export type AssessmentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    /**
     * Filter, which Assessments to fetch.
     */
    where?: AssessmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assessments to fetch.
     */
    orderBy?: AssessmentsOrderByWithRelationInput | AssessmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assessments.
     */
    cursor?: AssessmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assessments.
     */
    distinct?: AssessmentsScalarFieldEnum | AssessmentsScalarFieldEnum[]
  }

  /**
   * Assessments findFirstOrThrow
   */
  export type AssessmentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    /**
     * Filter, which Assessments to fetch.
     */
    where?: AssessmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assessments to fetch.
     */
    orderBy?: AssessmentsOrderByWithRelationInput | AssessmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assessments.
     */
    cursor?: AssessmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assessments.
     */
    distinct?: AssessmentsScalarFieldEnum | AssessmentsScalarFieldEnum[]
  }

  /**
   * Assessments findMany
   */
  export type AssessmentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    /**
     * Filter, which Assessments to fetch.
     */
    where?: AssessmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assessments to fetch.
     */
    orderBy?: AssessmentsOrderByWithRelationInput | AssessmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Assessments.
     */
    cursor?: AssessmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assessments.
     */
    skip?: number
    distinct?: AssessmentsScalarFieldEnum | AssessmentsScalarFieldEnum[]
  }

  /**
   * Assessments create
   */
  export type AssessmentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    /**
     * The data needed to create a Assessments.
     */
    data: XOR<AssessmentsCreateInput, AssessmentsUncheckedCreateInput>
  }

  /**
   * Assessments createMany
   */
  export type AssessmentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Assessments.
     */
    data: AssessmentsCreateManyInput | AssessmentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Assessments createManyAndReturn
   */
  export type AssessmentsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * The data used to create many Assessments.
     */
    data: AssessmentsCreateManyInput | AssessmentsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Assessments update
   */
  export type AssessmentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    /**
     * The data needed to update a Assessments.
     */
    data: XOR<AssessmentsUpdateInput, AssessmentsUncheckedUpdateInput>
    /**
     * Choose, which Assessments to update.
     */
    where: AssessmentsWhereUniqueInput
  }

  /**
   * Assessments updateMany
   */
  export type AssessmentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Assessments.
     */
    data: XOR<AssessmentsUpdateManyMutationInput, AssessmentsUncheckedUpdateManyInput>
    /**
     * Filter which Assessments to update
     */
    where?: AssessmentsWhereInput
    /**
     * Limit how many Assessments to update.
     */
    limit?: number
  }

  /**
   * Assessments updateManyAndReturn
   */
  export type AssessmentsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * The data used to update Assessments.
     */
    data: XOR<AssessmentsUpdateManyMutationInput, AssessmentsUncheckedUpdateManyInput>
    /**
     * Filter which Assessments to update
     */
    where?: AssessmentsWhereInput
    /**
     * Limit how many Assessments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Assessments upsert
   */
  export type AssessmentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    /**
     * The filter to search for the Assessments to update in case it exists.
     */
    where: AssessmentsWhereUniqueInput
    /**
     * In case the Assessments found by the `where` argument doesn't exist, create a new Assessments with this data.
     */
    create: XOR<AssessmentsCreateInput, AssessmentsUncheckedCreateInput>
    /**
     * In case the Assessments was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssessmentsUpdateInput, AssessmentsUncheckedUpdateInput>
  }

  /**
   * Assessments delete
   */
  export type AssessmentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
    /**
     * Filter which Assessments to delete.
     */
    where: AssessmentsWhereUniqueInput
  }

  /**
   * Assessments deleteMany
   */
  export type AssessmentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assessments to delete
     */
    where?: AssessmentsWhereInput
    /**
     * Limit how many Assessments to delete.
     */
    limit?: number
  }

  /**
   * Assessments.result
   */
  export type Assessments$resultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Result
     */
    select?: ResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Result
     */
    omit?: ResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResultInclude<ExtArgs> | null
    where?: ResultWhereInput
  }

  /**
   * Assessments without action
   */
  export type AssessmentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assessments
     */
    select?: AssessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assessments
     */
    omit?: AssessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessmentsInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    school_uuid: 'school_uuid',
    name: 'name',
    email: 'email',
    password: 'password',
    contact: 'contact',
    alt_contact: 'alt_contact',
    avatar: 'avatar',
    address: 'address',
    role: 'role',
    position: 'position',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccessControlScalarFieldEnum: {
    id: 'id',
    user_uuid: 'user_uuid',
    branch_uuid: 'branch_uuid',
    access: 'access'
  };

  export type AccessControlScalarFieldEnum = (typeof AccessControlScalarFieldEnum)[keyof typeof AccessControlScalarFieldEnum]


  export const SchoolScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    token: 'token',
    email: 'email',
    slug: 'slug',
    name: 'name',
    contact: 'contact',
    avatar: 'avatar',
    address: 'address',
    city: 'city',
    state: 'state',
    country: 'country',
    zip: 'zip',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type SchoolScalarFieldEnum = (typeof SchoolScalarFieldEnum)[keyof typeof SchoolScalarFieldEnum]


  export const BranchScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    school_uuid: 'school_uuid',
    name: 'name',
    email: 'email',
    contact: 'contact',
    avatar: 'avatar',
    address: 'address',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type BranchScalarFieldEnum = (typeof BranchScalarFieldEnum)[keyof typeof BranchScalarFieldEnum]


  export const BranchAccessScalarFieldEnum: {
    id: 'id',
    role: 'role',
    user_uuid: 'user_uuid',
    school_uuid: 'school_uuid',
    branch_uuid: 'branch_uuid'
  };

  export type BranchAccessScalarFieldEnum = (typeof BranchAccessScalarFieldEnum)[keyof typeof BranchAccessScalarFieldEnum]


  export const StudentScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    parent_uuid: 'parent_uuid',
    branch_uuid: 'branch_uuid',
    class_uuid: 'class_uuid',
    reg_number: 'reg_number',
    name: 'name',
    avatar: 'avatar',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type StudentScalarFieldEnum = (typeof StudentScalarFieldEnum)[keyof typeof StudentScalarFieldEnum]


  export const ClassScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    branch_uuid: 'branch_uuid',
    name: 'name',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ClassScalarFieldEnum = (typeof ClassScalarFieldEnum)[keyof typeof ClassScalarFieldEnum]


  export const SubjectScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    class_uuid: 'class_uuid',
    name: 'name',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type SubjectScalarFieldEnum = (typeof SubjectScalarFieldEnum)[keyof typeof SubjectScalarFieldEnum]


  export const GradeScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    branch_uuid: 'branch_uuid',
    score: 'score',
    grade: 'grade',
    remark: 'remark',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type GradeScalarFieldEnum = (typeof GradeScalarFieldEnum)[keyof typeof GradeScalarFieldEnum]


  export const ResultScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    student_uuid: 'student_uuid',
    class_name: 'class_name',
    grade: 'grade',
    remark: 'remark',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ResultScalarFieldEnum = (typeof ResultScalarFieldEnum)[keyof typeof ResultScalarFieldEnum]


  export const AssessmentsScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    result_uuid: 'result_uuid',
    subject: 'subject',
    assignment: 'assignment',
    assesment: 'assesment',
    examination: 'examination',
    overall: 'overall',
    grade: 'grade',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type AssessmentsScalarFieldEnum = (typeof AssessmentsScalarFieldEnum)[keyof typeof AssessmentsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    uuid?: StringFilter<"User"> | string
    school_uuid?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    contact?: StringNullableFilter<"User"> | string | null
    alt_contact?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    position?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    school?: XOR<SchoolNullableScalarRelationFilter, SchoolWhereInput> | null
    students?: StudentListRelationFilter
    access?: BranchAccessListRelationFilter
    control?: AccessControlListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    contact?: SortOrderInput | SortOrder
    alt_contact?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    role?: SortOrder
    position?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    school?: SchoolOrderByWithRelationInput
    students?: StudentOrderByRelationAggregateInput
    access?: BranchAccessOrderByRelationAggregateInput
    control?: AccessControlOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    school_uuid_email_role?: UserSchool_uuidEmailRoleCompoundUniqueInput
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    school_uuid?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    contact?: StringNullableFilter<"User"> | string | null
    alt_contact?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    position?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    school?: XOR<SchoolNullableScalarRelationFilter, SchoolWhereInput> | null
    students?: StudentListRelationFilter
    access?: BranchAccessListRelationFilter
    control?: AccessControlListRelationFilter
  }, "id" | "uuid" | "school_uuid_email_role">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    contact?: SortOrderInput | SortOrder
    alt_contact?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    role?: SortOrder
    position?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    uuid?: StringWithAggregatesFilter<"User"> | string
    school_uuid?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    contact?: StringNullableWithAggregatesFilter<"User"> | string | null
    alt_contact?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    position?: StringWithAggregatesFilter<"User"> | string
    status?: StringWithAggregatesFilter<"User"> | string
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccessControlWhereInput = {
    AND?: AccessControlWhereInput | AccessControlWhereInput[]
    OR?: AccessControlWhereInput[]
    NOT?: AccessControlWhereInput | AccessControlWhereInput[]
    id?: IntFilter<"AccessControl"> | number
    user_uuid?: StringFilter<"AccessControl"> | string
    branch_uuid?: StringFilter<"AccessControl"> | string
    access?: StringFilter<"AccessControl"> | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    branch?: XOR<BranchNullableScalarRelationFilter, BranchWhereInput> | null
  }

  export type AccessControlOrderByWithRelationInput = {
    id?: SortOrder
    user_uuid?: SortOrder
    branch_uuid?: SortOrder
    access?: SortOrder
    user?: UserOrderByWithRelationInput
    branch?: BranchOrderByWithRelationInput
  }

  export type AccessControlWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    user_uuid_branch_uuid_access?: AccessControlUser_uuidBranch_uuidAccessCompoundUniqueInput
    AND?: AccessControlWhereInput | AccessControlWhereInput[]
    OR?: AccessControlWhereInput[]
    NOT?: AccessControlWhereInput | AccessControlWhereInput[]
    user_uuid?: StringFilter<"AccessControl"> | string
    branch_uuid?: StringFilter<"AccessControl"> | string
    access?: StringFilter<"AccessControl"> | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    branch?: XOR<BranchNullableScalarRelationFilter, BranchWhereInput> | null
  }, "id" | "user_uuid_branch_uuid_access">

  export type AccessControlOrderByWithAggregationInput = {
    id?: SortOrder
    user_uuid?: SortOrder
    branch_uuid?: SortOrder
    access?: SortOrder
    _count?: AccessControlCountOrderByAggregateInput
    _avg?: AccessControlAvgOrderByAggregateInput
    _max?: AccessControlMaxOrderByAggregateInput
    _min?: AccessControlMinOrderByAggregateInput
    _sum?: AccessControlSumOrderByAggregateInput
  }

  export type AccessControlScalarWhereWithAggregatesInput = {
    AND?: AccessControlScalarWhereWithAggregatesInput | AccessControlScalarWhereWithAggregatesInput[]
    OR?: AccessControlScalarWhereWithAggregatesInput[]
    NOT?: AccessControlScalarWhereWithAggregatesInput | AccessControlScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AccessControl"> | number
    user_uuid?: StringWithAggregatesFilter<"AccessControl"> | string
    branch_uuid?: StringWithAggregatesFilter<"AccessControl"> | string
    access?: StringWithAggregatesFilter<"AccessControl"> | string
  }

  export type SchoolWhereInput = {
    AND?: SchoolWhereInput | SchoolWhereInput[]
    OR?: SchoolWhereInput[]
    NOT?: SchoolWhereInput | SchoolWhereInput[]
    id?: IntFilter<"School"> | number
    uuid?: StringFilter<"School"> | string
    token?: StringFilter<"School"> | string
    email?: StringFilter<"School"> | string
    slug?: StringFilter<"School"> | string
    name?: StringFilter<"School"> | string
    contact?: StringNullableFilter<"School"> | string | null
    avatar?: StringNullableFilter<"School"> | string | null
    address?: StringNullableFilter<"School"> | string | null
    city?: StringNullableFilter<"School"> | string | null
    state?: StringNullableFilter<"School"> | string | null
    country?: StringNullableFilter<"School"> | string | null
    zip?: StringNullableFilter<"School"> | string | null
    created_at?: DateTimeFilter<"School"> | Date | string
    updated_at?: DateTimeFilter<"School"> | Date | string
    users?: UserListRelationFilter
    branches?: BranchListRelationFilter
    access?: BranchAccessListRelationFilter
  }

  export type SchoolOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    token?: SortOrder
    email?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    contact?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    zip?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    users?: UserOrderByRelationAggregateInput
    branches?: BranchOrderByRelationAggregateInput
    access?: BranchAccessOrderByRelationAggregateInput
  }

  export type SchoolWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    token?: string
    email?: string
    slug?: string
    AND?: SchoolWhereInput | SchoolWhereInput[]
    OR?: SchoolWhereInput[]
    NOT?: SchoolWhereInput | SchoolWhereInput[]
    name?: StringFilter<"School"> | string
    contact?: StringNullableFilter<"School"> | string | null
    avatar?: StringNullableFilter<"School"> | string | null
    address?: StringNullableFilter<"School"> | string | null
    city?: StringNullableFilter<"School"> | string | null
    state?: StringNullableFilter<"School"> | string | null
    country?: StringNullableFilter<"School"> | string | null
    zip?: StringNullableFilter<"School"> | string | null
    created_at?: DateTimeFilter<"School"> | Date | string
    updated_at?: DateTimeFilter<"School"> | Date | string
    users?: UserListRelationFilter
    branches?: BranchListRelationFilter
    access?: BranchAccessListRelationFilter
  }, "id" | "uuid" | "token" | "email" | "slug">

  export type SchoolOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    token?: SortOrder
    email?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    contact?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    zip?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: SchoolCountOrderByAggregateInput
    _avg?: SchoolAvgOrderByAggregateInput
    _max?: SchoolMaxOrderByAggregateInput
    _min?: SchoolMinOrderByAggregateInput
    _sum?: SchoolSumOrderByAggregateInput
  }

  export type SchoolScalarWhereWithAggregatesInput = {
    AND?: SchoolScalarWhereWithAggregatesInput | SchoolScalarWhereWithAggregatesInput[]
    OR?: SchoolScalarWhereWithAggregatesInput[]
    NOT?: SchoolScalarWhereWithAggregatesInput | SchoolScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"School"> | number
    uuid?: StringWithAggregatesFilter<"School"> | string
    token?: StringWithAggregatesFilter<"School"> | string
    email?: StringWithAggregatesFilter<"School"> | string
    slug?: StringWithAggregatesFilter<"School"> | string
    name?: StringWithAggregatesFilter<"School"> | string
    contact?: StringNullableWithAggregatesFilter<"School"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"School"> | string | null
    address?: StringNullableWithAggregatesFilter<"School"> | string | null
    city?: StringNullableWithAggregatesFilter<"School"> | string | null
    state?: StringNullableWithAggregatesFilter<"School"> | string | null
    country?: StringNullableWithAggregatesFilter<"School"> | string | null
    zip?: StringNullableWithAggregatesFilter<"School"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"School"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"School"> | Date | string
  }

  export type BranchWhereInput = {
    AND?: BranchWhereInput | BranchWhereInput[]
    OR?: BranchWhereInput[]
    NOT?: BranchWhereInput | BranchWhereInput[]
    id?: IntFilter<"Branch"> | number
    uuid?: StringFilter<"Branch"> | string
    school_uuid?: StringFilter<"Branch"> | string
    name?: StringFilter<"Branch"> | string
    email?: StringNullableFilter<"Branch"> | string | null
    contact?: StringNullableFilter<"Branch"> | string | null
    avatar?: StringNullableFilter<"Branch"> | string | null
    address?: StringNullableFilter<"Branch"> | string | null
    created_at?: DateTimeFilter<"Branch"> | Date | string
    updated_at?: DateTimeFilter<"Branch"> | Date | string
    grades?: GradeListRelationFilter
    classes?: ClassListRelationFilter
    students?: StudentListRelationFilter
    control?: AccessControlListRelationFilter
    access?: BranchAccessListRelationFilter
    school?: XOR<SchoolScalarRelationFilter, SchoolWhereInput>
  }

  export type BranchOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    contact?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    grades?: GradeOrderByRelationAggregateInput
    classes?: ClassOrderByRelationAggregateInput
    students?: StudentOrderByRelationAggregateInput
    control?: AccessControlOrderByRelationAggregateInput
    access?: BranchAccessOrderByRelationAggregateInput
    school?: SchoolOrderByWithRelationInput
  }

  export type BranchWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    AND?: BranchWhereInput | BranchWhereInput[]
    OR?: BranchWhereInput[]
    NOT?: BranchWhereInput | BranchWhereInput[]
    school_uuid?: StringFilter<"Branch"> | string
    name?: StringFilter<"Branch"> | string
    email?: StringNullableFilter<"Branch"> | string | null
    contact?: StringNullableFilter<"Branch"> | string | null
    avatar?: StringNullableFilter<"Branch"> | string | null
    address?: StringNullableFilter<"Branch"> | string | null
    created_at?: DateTimeFilter<"Branch"> | Date | string
    updated_at?: DateTimeFilter<"Branch"> | Date | string
    grades?: GradeListRelationFilter
    classes?: ClassListRelationFilter
    students?: StudentListRelationFilter
    control?: AccessControlListRelationFilter
    access?: BranchAccessListRelationFilter
    school?: XOR<SchoolScalarRelationFilter, SchoolWhereInput>
  }, "id" | "uuid">

  export type BranchOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    contact?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: BranchCountOrderByAggregateInput
    _avg?: BranchAvgOrderByAggregateInput
    _max?: BranchMaxOrderByAggregateInput
    _min?: BranchMinOrderByAggregateInput
    _sum?: BranchSumOrderByAggregateInput
  }

  export type BranchScalarWhereWithAggregatesInput = {
    AND?: BranchScalarWhereWithAggregatesInput | BranchScalarWhereWithAggregatesInput[]
    OR?: BranchScalarWhereWithAggregatesInput[]
    NOT?: BranchScalarWhereWithAggregatesInput | BranchScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Branch"> | number
    uuid?: StringWithAggregatesFilter<"Branch"> | string
    school_uuid?: StringWithAggregatesFilter<"Branch"> | string
    name?: StringWithAggregatesFilter<"Branch"> | string
    email?: StringNullableWithAggregatesFilter<"Branch"> | string | null
    contact?: StringNullableWithAggregatesFilter<"Branch"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"Branch"> | string | null
    address?: StringNullableWithAggregatesFilter<"Branch"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Branch"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Branch"> | Date | string
  }

  export type BranchAccessWhereInput = {
    AND?: BranchAccessWhereInput | BranchAccessWhereInput[]
    OR?: BranchAccessWhereInput[]
    NOT?: BranchAccessWhereInput | BranchAccessWhereInput[]
    id?: IntFilter<"BranchAccess"> | number
    role?: EnumRoleFilter<"BranchAccess"> | $Enums.Role
    user_uuid?: StringFilter<"BranchAccess"> | string
    school_uuid?: StringFilter<"BranchAccess"> | string
    branch_uuid?: StringFilter<"BranchAccess"> | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    school?: XOR<SchoolNullableScalarRelationFilter, SchoolWhereInput> | null
    branch?: XOR<BranchNullableScalarRelationFilter, BranchWhereInput> | null
  }

  export type BranchAccessOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    user_uuid?: SortOrder
    school_uuid?: SortOrder
    branch_uuid?: SortOrder
    user?: UserOrderByWithRelationInput
    school?: SchoolOrderByWithRelationInput
    branch?: BranchOrderByWithRelationInput
  }

  export type BranchAccessWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    user_uuid_branch_uuid_role?: BranchAccessUser_uuidBranch_uuidRoleCompoundUniqueInput
    AND?: BranchAccessWhereInput | BranchAccessWhereInput[]
    OR?: BranchAccessWhereInput[]
    NOT?: BranchAccessWhereInput | BranchAccessWhereInput[]
    role?: EnumRoleFilter<"BranchAccess"> | $Enums.Role
    user_uuid?: StringFilter<"BranchAccess"> | string
    school_uuid?: StringFilter<"BranchAccess"> | string
    branch_uuid?: StringFilter<"BranchAccess"> | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    school?: XOR<SchoolNullableScalarRelationFilter, SchoolWhereInput> | null
    branch?: XOR<BranchNullableScalarRelationFilter, BranchWhereInput> | null
  }, "id" | "user_uuid_branch_uuid_role">

  export type BranchAccessOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    user_uuid?: SortOrder
    school_uuid?: SortOrder
    branch_uuid?: SortOrder
    _count?: BranchAccessCountOrderByAggregateInput
    _avg?: BranchAccessAvgOrderByAggregateInput
    _max?: BranchAccessMaxOrderByAggregateInput
    _min?: BranchAccessMinOrderByAggregateInput
    _sum?: BranchAccessSumOrderByAggregateInput
  }

  export type BranchAccessScalarWhereWithAggregatesInput = {
    AND?: BranchAccessScalarWhereWithAggregatesInput | BranchAccessScalarWhereWithAggregatesInput[]
    OR?: BranchAccessScalarWhereWithAggregatesInput[]
    NOT?: BranchAccessScalarWhereWithAggregatesInput | BranchAccessScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BranchAccess"> | number
    role?: EnumRoleWithAggregatesFilter<"BranchAccess"> | $Enums.Role
    user_uuid?: StringWithAggregatesFilter<"BranchAccess"> | string
    school_uuid?: StringWithAggregatesFilter<"BranchAccess"> | string
    branch_uuid?: StringWithAggregatesFilter<"BranchAccess"> | string
  }

  export type StudentWhereInput = {
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    id?: IntFilter<"Student"> | number
    uuid?: StringFilter<"Student"> | string
    parent_uuid?: StringFilter<"Student"> | string
    branch_uuid?: StringFilter<"Student"> | string
    class_uuid?: StringFilter<"Student"> | string
    reg_number?: StringFilter<"Student"> | string
    name?: StringFilter<"Student"> | string
    avatar?: StringNullableFilter<"Student"> | string | null
    created_at?: DateTimeFilter<"Student"> | Date | string
    updated_at?: DateTimeFilter<"Student"> | Date | string
    parent?: XOR<UserScalarRelationFilter, UserWhereInput>
    branch?: XOR<BranchScalarRelationFilter, BranchWhereInput>
    class?: XOR<ClassScalarRelationFilter, ClassWhereInput>
    results?: ResultListRelationFilter
  }

  export type StudentOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    parent_uuid?: SortOrder
    branch_uuid?: SortOrder
    class_uuid?: SortOrder
    reg_number?: SortOrder
    name?: SortOrder
    avatar?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    parent?: UserOrderByWithRelationInput
    branch?: BranchOrderByWithRelationInput
    class?: ClassOrderByWithRelationInput
    results?: ResultOrderByRelationAggregateInput
  }

  export type StudentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    branch_uuid_reg_number?: StudentBranch_uuidReg_numberCompoundUniqueInput
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    parent_uuid?: StringFilter<"Student"> | string
    branch_uuid?: StringFilter<"Student"> | string
    class_uuid?: StringFilter<"Student"> | string
    reg_number?: StringFilter<"Student"> | string
    name?: StringFilter<"Student"> | string
    avatar?: StringNullableFilter<"Student"> | string | null
    created_at?: DateTimeFilter<"Student"> | Date | string
    updated_at?: DateTimeFilter<"Student"> | Date | string
    parent?: XOR<UserScalarRelationFilter, UserWhereInput>
    branch?: XOR<BranchScalarRelationFilter, BranchWhereInput>
    class?: XOR<ClassScalarRelationFilter, ClassWhereInput>
    results?: ResultListRelationFilter
  }, "id" | "uuid" | "branch_uuid_reg_number">

  export type StudentOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    parent_uuid?: SortOrder
    branch_uuid?: SortOrder
    class_uuid?: SortOrder
    reg_number?: SortOrder
    name?: SortOrder
    avatar?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: StudentCountOrderByAggregateInput
    _avg?: StudentAvgOrderByAggregateInput
    _max?: StudentMaxOrderByAggregateInput
    _min?: StudentMinOrderByAggregateInput
    _sum?: StudentSumOrderByAggregateInput
  }

  export type StudentScalarWhereWithAggregatesInput = {
    AND?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    OR?: StudentScalarWhereWithAggregatesInput[]
    NOT?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Student"> | number
    uuid?: StringWithAggregatesFilter<"Student"> | string
    parent_uuid?: StringWithAggregatesFilter<"Student"> | string
    branch_uuid?: StringWithAggregatesFilter<"Student"> | string
    class_uuid?: StringWithAggregatesFilter<"Student"> | string
    reg_number?: StringWithAggregatesFilter<"Student"> | string
    name?: StringWithAggregatesFilter<"Student"> | string
    avatar?: StringNullableWithAggregatesFilter<"Student"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Student"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Student"> | Date | string
  }

  export type ClassWhereInput = {
    AND?: ClassWhereInput | ClassWhereInput[]
    OR?: ClassWhereInput[]
    NOT?: ClassWhereInput | ClassWhereInput[]
    id?: IntFilter<"Class"> | number
    uuid?: StringFilter<"Class"> | string
    branch_uuid?: StringFilter<"Class"> | string
    name?: StringFilter<"Class"> | string
    status?: StringFilter<"Class"> | string
    created_at?: DateTimeFilter<"Class"> | Date | string
    updated_at?: DateTimeFilter<"Class"> | Date | string
    branch?: XOR<BranchNullableScalarRelationFilter, BranchWhereInput> | null
    subjects?: SubjectListRelationFilter
    students?: StudentListRelationFilter
  }

  export type ClassOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    name?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    branch?: BranchOrderByWithRelationInput
    subjects?: SubjectOrderByRelationAggregateInput
    students?: StudentOrderByRelationAggregateInput
  }

  export type ClassWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    AND?: ClassWhereInput | ClassWhereInput[]
    OR?: ClassWhereInput[]
    NOT?: ClassWhereInput | ClassWhereInput[]
    branch_uuid?: StringFilter<"Class"> | string
    name?: StringFilter<"Class"> | string
    status?: StringFilter<"Class"> | string
    created_at?: DateTimeFilter<"Class"> | Date | string
    updated_at?: DateTimeFilter<"Class"> | Date | string
    branch?: XOR<BranchNullableScalarRelationFilter, BranchWhereInput> | null
    subjects?: SubjectListRelationFilter
    students?: StudentListRelationFilter
  }, "id" | "uuid">

  export type ClassOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    name?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ClassCountOrderByAggregateInput
    _avg?: ClassAvgOrderByAggregateInput
    _max?: ClassMaxOrderByAggregateInput
    _min?: ClassMinOrderByAggregateInput
    _sum?: ClassSumOrderByAggregateInput
  }

  export type ClassScalarWhereWithAggregatesInput = {
    AND?: ClassScalarWhereWithAggregatesInput | ClassScalarWhereWithAggregatesInput[]
    OR?: ClassScalarWhereWithAggregatesInput[]
    NOT?: ClassScalarWhereWithAggregatesInput | ClassScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Class"> | number
    uuid?: StringWithAggregatesFilter<"Class"> | string
    branch_uuid?: StringWithAggregatesFilter<"Class"> | string
    name?: StringWithAggregatesFilter<"Class"> | string
    status?: StringWithAggregatesFilter<"Class"> | string
    created_at?: DateTimeWithAggregatesFilter<"Class"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Class"> | Date | string
  }

  export type SubjectWhereInput = {
    AND?: SubjectWhereInput | SubjectWhereInput[]
    OR?: SubjectWhereInput[]
    NOT?: SubjectWhereInput | SubjectWhereInput[]
    id?: IntFilter<"Subject"> | number
    uuid?: StringFilter<"Subject"> | string
    class_uuid?: StringFilter<"Subject"> | string
    name?: StringFilter<"Subject"> | string
    created_at?: DateTimeFilter<"Subject"> | Date | string
    updated_at?: DateTimeFilter<"Subject"> | Date | string
    class?: XOR<ClassNullableScalarRelationFilter, ClassWhereInput> | null
  }

  export type SubjectOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    class_uuid?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    class?: ClassOrderByWithRelationInput
  }

  export type SubjectWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    AND?: SubjectWhereInput | SubjectWhereInput[]
    OR?: SubjectWhereInput[]
    NOT?: SubjectWhereInput | SubjectWhereInput[]
    class_uuid?: StringFilter<"Subject"> | string
    name?: StringFilter<"Subject"> | string
    created_at?: DateTimeFilter<"Subject"> | Date | string
    updated_at?: DateTimeFilter<"Subject"> | Date | string
    class?: XOR<ClassNullableScalarRelationFilter, ClassWhereInput> | null
  }, "id" | "uuid">

  export type SubjectOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    class_uuid?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: SubjectCountOrderByAggregateInput
    _avg?: SubjectAvgOrderByAggregateInput
    _max?: SubjectMaxOrderByAggregateInput
    _min?: SubjectMinOrderByAggregateInput
    _sum?: SubjectSumOrderByAggregateInput
  }

  export type SubjectScalarWhereWithAggregatesInput = {
    AND?: SubjectScalarWhereWithAggregatesInput | SubjectScalarWhereWithAggregatesInput[]
    OR?: SubjectScalarWhereWithAggregatesInput[]
    NOT?: SubjectScalarWhereWithAggregatesInput | SubjectScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Subject"> | number
    uuid?: StringWithAggregatesFilter<"Subject"> | string
    class_uuid?: StringWithAggregatesFilter<"Subject"> | string
    name?: StringWithAggregatesFilter<"Subject"> | string
    created_at?: DateTimeWithAggregatesFilter<"Subject"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Subject"> | Date | string
  }

  export type GradeWhereInput = {
    AND?: GradeWhereInput | GradeWhereInput[]
    OR?: GradeWhereInput[]
    NOT?: GradeWhereInput | GradeWhereInput[]
    id?: IntFilter<"Grade"> | number
    uuid?: StringFilter<"Grade"> | string
    branch_uuid?: StringFilter<"Grade"> | string
    score?: FloatFilter<"Grade"> | number
    grade?: StringFilter<"Grade"> | string
    remark?: StringFilter<"Grade"> | string
    created_at?: DateTimeFilter<"Grade"> | Date | string
    updated_at?: DateTimeFilter<"Grade"> | Date | string
    branch?: XOR<BranchNullableScalarRelationFilter, BranchWhereInput> | null
  }

  export type GradeOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    score?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    branch?: BranchOrderByWithRelationInput
  }

  export type GradeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    AND?: GradeWhereInput | GradeWhereInput[]
    OR?: GradeWhereInput[]
    NOT?: GradeWhereInput | GradeWhereInput[]
    branch_uuid?: StringFilter<"Grade"> | string
    score?: FloatFilter<"Grade"> | number
    grade?: StringFilter<"Grade"> | string
    remark?: StringFilter<"Grade"> | string
    created_at?: DateTimeFilter<"Grade"> | Date | string
    updated_at?: DateTimeFilter<"Grade"> | Date | string
    branch?: XOR<BranchNullableScalarRelationFilter, BranchWhereInput> | null
  }, "id" | "uuid">

  export type GradeOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    score?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: GradeCountOrderByAggregateInput
    _avg?: GradeAvgOrderByAggregateInput
    _max?: GradeMaxOrderByAggregateInput
    _min?: GradeMinOrderByAggregateInput
    _sum?: GradeSumOrderByAggregateInput
  }

  export type GradeScalarWhereWithAggregatesInput = {
    AND?: GradeScalarWhereWithAggregatesInput | GradeScalarWhereWithAggregatesInput[]
    OR?: GradeScalarWhereWithAggregatesInput[]
    NOT?: GradeScalarWhereWithAggregatesInput | GradeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Grade"> | number
    uuid?: StringWithAggregatesFilter<"Grade"> | string
    branch_uuid?: StringWithAggregatesFilter<"Grade"> | string
    score?: FloatWithAggregatesFilter<"Grade"> | number
    grade?: StringWithAggregatesFilter<"Grade"> | string
    remark?: StringWithAggregatesFilter<"Grade"> | string
    created_at?: DateTimeWithAggregatesFilter<"Grade"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Grade"> | Date | string
  }

  export type ResultWhereInput = {
    AND?: ResultWhereInput | ResultWhereInput[]
    OR?: ResultWhereInput[]
    NOT?: ResultWhereInput | ResultWhereInput[]
    id?: IntFilter<"Result"> | number
    uuid?: StringFilter<"Result"> | string
    student_uuid?: StringFilter<"Result"> | string
    class_name?: StringFilter<"Result"> | string
    grade?: StringFilter<"Result"> | string
    remark?: StringFilter<"Result"> | string
    created_at?: DateTimeFilter<"Result"> | Date | string
    updated_at?: DateTimeFilter<"Result"> | Date | string
    student?: XOR<StudentNullableScalarRelationFilter, StudentWhereInput> | null
    assessments?: AssessmentsListRelationFilter
  }

  export type ResultOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    student_uuid?: SortOrder
    class_name?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    student?: StudentOrderByWithRelationInput
    assessments?: AssessmentsOrderByRelationAggregateInput
  }

  export type ResultWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    AND?: ResultWhereInput | ResultWhereInput[]
    OR?: ResultWhereInput[]
    NOT?: ResultWhereInput | ResultWhereInput[]
    student_uuid?: StringFilter<"Result"> | string
    class_name?: StringFilter<"Result"> | string
    grade?: StringFilter<"Result"> | string
    remark?: StringFilter<"Result"> | string
    created_at?: DateTimeFilter<"Result"> | Date | string
    updated_at?: DateTimeFilter<"Result"> | Date | string
    student?: XOR<StudentNullableScalarRelationFilter, StudentWhereInput> | null
    assessments?: AssessmentsListRelationFilter
  }, "id" | "uuid">

  export type ResultOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    student_uuid?: SortOrder
    class_name?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ResultCountOrderByAggregateInput
    _avg?: ResultAvgOrderByAggregateInput
    _max?: ResultMaxOrderByAggregateInput
    _min?: ResultMinOrderByAggregateInput
    _sum?: ResultSumOrderByAggregateInput
  }

  export type ResultScalarWhereWithAggregatesInput = {
    AND?: ResultScalarWhereWithAggregatesInput | ResultScalarWhereWithAggregatesInput[]
    OR?: ResultScalarWhereWithAggregatesInput[]
    NOT?: ResultScalarWhereWithAggregatesInput | ResultScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Result"> | number
    uuid?: StringWithAggregatesFilter<"Result"> | string
    student_uuid?: StringWithAggregatesFilter<"Result"> | string
    class_name?: StringWithAggregatesFilter<"Result"> | string
    grade?: StringWithAggregatesFilter<"Result"> | string
    remark?: StringWithAggregatesFilter<"Result"> | string
    created_at?: DateTimeWithAggregatesFilter<"Result"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Result"> | Date | string
  }

  export type AssessmentsWhereInput = {
    AND?: AssessmentsWhereInput | AssessmentsWhereInput[]
    OR?: AssessmentsWhereInput[]
    NOT?: AssessmentsWhereInput | AssessmentsWhereInput[]
    id?: IntFilter<"Assessments"> | number
    uuid?: StringFilter<"Assessments"> | string
    result_uuid?: StringFilter<"Assessments"> | string
    subject?: StringFilter<"Assessments"> | string
    assignment?: FloatFilter<"Assessments"> | number
    assesment?: FloatFilter<"Assessments"> | number
    examination?: FloatFilter<"Assessments"> | number
    overall?: FloatFilter<"Assessments"> | number
    grade?: StringFilter<"Assessments"> | string
    created_at?: DateTimeFilter<"Assessments"> | Date | string
    updated_at?: DateTimeFilter<"Assessments"> | Date | string
    result?: XOR<ResultNullableScalarRelationFilter, ResultWhereInput> | null
  }

  export type AssessmentsOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    result_uuid?: SortOrder
    subject?: SortOrder
    assignment?: SortOrder
    assesment?: SortOrder
    examination?: SortOrder
    overall?: SortOrder
    grade?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    result?: ResultOrderByWithRelationInput
  }

  export type AssessmentsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    result_uuid_subject?: AssessmentsResult_uuidSubjectCompoundUniqueInput
    AND?: AssessmentsWhereInput | AssessmentsWhereInput[]
    OR?: AssessmentsWhereInput[]
    NOT?: AssessmentsWhereInput | AssessmentsWhereInput[]
    result_uuid?: StringFilter<"Assessments"> | string
    subject?: StringFilter<"Assessments"> | string
    assignment?: FloatFilter<"Assessments"> | number
    assesment?: FloatFilter<"Assessments"> | number
    examination?: FloatFilter<"Assessments"> | number
    overall?: FloatFilter<"Assessments"> | number
    grade?: StringFilter<"Assessments"> | string
    created_at?: DateTimeFilter<"Assessments"> | Date | string
    updated_at?: DateTimeFilter<"Assessments"> | Date | string
    result?: XOR<ResultNullableScalarRelationFilter, ResultWhereInput> | null
  }, "id" | "uuid" | "result_uuid_subject">

  export type AssessmentsOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    result_uuid?: SortOrder
    subject?: SortOrder
    assignment?: SortOrder
    assesment?: SortOrder
    examination?: SortOrder
    overall?: SortOrder
    grade?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: AssessmentsCountOrderByAggregateInput
    _avg?: AssessmentsAvgOrderByAggregateInput
    _max?: AssessmentsMaxOrderByAggregateInput
    _min?: AssessmentsMinOrderByAggregateInput
    _sum?: AssessmentsSumOrderByAggregateInput
  }

  export type AssessmentsScalarWhereWithAggregatesInput = {
    AND?: AssessmentsScalarWhereWithAggregatesInput | AssessmentsScalarWhereWithAggregatesInput[]
    OR?: AssessmentsScalarWhereWithAggregatesInput[]
    NOT?: AssessmentsScalarWhereWithAggregatesInput | AssessmentsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Assessments"> | number
    uuid?: StringWithAggregatesFilter<"Assessments"> | string
    result_uuid?: StringWithAggregatesFilter<"Assessments"> | string
    subject?: StringWithAggregatesFilter<"Assessments"> | string
    assignment?: FloatWithAggregatesFilter<"Assessments"> | number
    assesment?: FloatWithAggregatesFilter<"Assessments"> | number
    examination?: FloatWithAggregatesFilter<"Assessments"> | number
    overall?: FloatWithAggregatesFilter<"Assessments"> | number
    grade?: StringWithAggregatesFilter<"Assessments"> | string
    created_at?: DateTimeWithAggregatesFilter<"Assessments"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Assessments"> | Date | string
  }

  export type UserCreateInput = {
    uuid?: string
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    school?: SchoolCreateNestedOneWithoutUsersInput
    students?: StudentCreateNestedManyWithoutParentInput
    access?: BranchAccessCreateNestedManyWithoutUserInput
    control?: AccessControlCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    uuid?: string
    school_uuid?: string | null
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    students?: StudentUncheckedCreateNestedManyWithoutParentInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutUserInput
    control?: AccessControlUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    school?: SchoolUpdateOneWithoutUsersNestedInput
    students?: StudentUpdateManyWithoutParentNestedInput
    access?: BranchAccessUpdateManyWithoutUserNestedInput
    control?: AccessControlUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUncheckedUpdateManyWithoutParentNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutUserNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    uuid?: string
    school_uuid?: string | null
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessControlCreateInput = {
    access: string
    user?: UserCreateNestedOneWithoutControlInput
    branch?: BranchCreateNestedOneWithoutControlInput
  }

  export type AccessControlUncheckedCreateInput = {
    id?: number
    user_uuid: string
    branch_uuid: string
    access: string
  }

  export type AccessControlUpdateInput = {
    access?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneWithoutControlNestedInput
    branch?: BranchUpdateOneWithoutControlNestedInput
  }

  export type AccessControlUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    access?: StringFieldUpdateOperationsInput | string
  }

  export type AccessControlCreateManyInput = {
    id?: number
    user_uuid: string
    branch_uuid: string
    access: string
  }

  export type AccessControlUpdateManyMutationInput = {
    access?: StringFieldUpdateOperationsInput | string
  }

  export type AccessControlUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    access?: StringFieldUpdateOperationsInput | string
  }

  export type SchoolCreateInput = {
    uuid?: string
    token?: string
    email: string
    slug: string
    name: string
    contact?: string | null
    avatar?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutSchoolInput
    branches?: BranchCreateNestedManyWithoutSchoolInput
    access?: BranchAccessCreateNestedManyWithoutSchoolInput
  }

  export type SchoolUncheckedCreateInput = {
    id?: number
    uuid?: string
    token?: string
    email: string
    slug: string
    name: string
    contact?: string | null
    avatar?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutSchoolInput
    branches?: BranchUncheckedCreateNestedManyWithoutSchoolInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutSchoolInput
  }

  export type SchoolUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutSchoolNestedInput
    branches?: BranchUpdateManyWithoutSchoolNestedInput
    access?: BranchAccessUpdateManyWithoutSchoolNestedInput
  }

  export type SchoolUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutSchoolNestedInput
    branches?: BranchUncheckedUpdateManyWithoutSchoolNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutSchoolNestedInput
  }

  export type SchoolCreateManyInput = {
    id?: number
    uuid?: string
    token?: string
    email: string
    slug: string
    name: string
    contact?: string | null
    avatar?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SchoolUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SchoolUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BranchCreateInput = {
    uuid?: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeCreateNestedManyWithoutBranchInput
    classes?: ClassCreateNestedManyWithoutBranchInput
    students?: StudentCreateNestedManyWithoutBranchInput
    control?: AccessControlCreateNestedManyWithoutBranchInput
    access?: BranchAccessCreateNestedManyWithoutBranchInput
    school: SchoolCreateNestedOneWithoutBranchesInput
  }

  export type BranchUncheckedCreateInput = {
    id?: number
    uuid?: string
    school_uuid: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeUncheckedCreateNestedManyWithoutBranchInput
    classes?: ClassUncheckedCreateNestedManyWithoutBranchInput
    students?: StudentUncheckedCreateNestedManyWithoutBranchInput
    control?: AccessControlUncheckedCreateNestedManyWithoutBranchInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutBranchInput
  }

  export type BranchUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUpdateManyWithoutBranchNestedInput
    classes?: ClassUpdateManyWithoutBranchNestedInput
    students?: StudentUpdateManyWithoutBranchNestedInput
    control?: AccessControlUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUpdateManyWithoutBranchNestedInput
    school?: SchoolUpdateOneRequiredWithoutBranchesNestedInput
  }

  export type BranchUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUncheckedUpdateManyWithoutBranchNestedInput
    classes?: ClassUncheckedUpdateManyWithoutBranchNestedInput
    students?: StudentUncheckedUpdateManyWithoutBranchNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutBranchNestedInput
  }

  export type BranchCreateManyInput = {
    id?: number
    uuid?: string
    school_uuid: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BranchUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BranchUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BranchAccessCreateInput = {
    role: $Enums.Role
    user?: UserCreateNestedOneWithoutAccessInput
    school?: SchoolCreateNestedOneWithoutAccessInput
    branch?: BranchCreateNestedOneWithoutAccessInput
  }

  export type BranchAccessUncheckedCreateInput = {
    id?: number
    role: $Enums.Role
    user_uuid: string
    school_uuid: string
    branch_uuid: string
  }

  export type BranchAccessUpdateInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    user?: UserUpdateOneWithoutAccessNestedInput
    school?: SchoolUpdateOneWithoutAccessNestedInput
    branch?: BranchUpdateOneWithoutAccessNestedInput
  }

  export type BranchAccessUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    user_uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type BranchAccessCreateManyInput = {
    id?: number
    role: $Enums.Role
    user_uuid: string
    school_uuid: string
    branch_uuid: string
  }

  export type BranchAccessUpdateManyMutationInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
  }

  export type BranchAccessUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    user_uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type StudentCreateInput = {
    uuid?: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    parent: UserCreateNestedOneWithoutStudentsInput
    branch: BranchCreateNestedOneWithoutStudentsInput
    class: ClassCreateNestedOneWithoutStudentsInput
    results?: ResultCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateInput = {
    id?: number
    uuid?: string
    parent_uuid: string
    branch_uuid: string
    class_uuid: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    results?: ResultUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: UserUpdateOneRequiredWithoutStudentsNestedInput
    branch?: BranchUpdateOneRequiredWithoutStudentsNestedInput
    class?: ClassUpdateOneRequiredWithoutStudentsNestedInput
    results?: ResultUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    parent_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    class_uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    results?: ResultUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateManyInput = {
    id?: number
    uuid?: string
    parent_uuid: string
    branch_uuid: string
    class_uuid: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type StudentUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    parent_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    class_uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassCreateInput = {
    uuid?: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    branch?: BranchCreateNestedOneWithoutClassesInput
    subjects?: SubjectCreateNestedManyWithoutClassInput
    students?: StudentCreateNestedManyWithoutClassInput
  }

  export type ClassUncheckedCreateInput = {
    id?: number
    uuid?: string
    branch_uuid: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    subjects?: SubjectUncheckedCreateNestedManyWithoutClassInput
    students?: StudentUncheckedCreateNestedManyWithoutClassInput
  }

  export type ClassUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    branch?: BranchUpdateOneWithoutClassesNestedInput
    subjects?: SubjectUpdateManyWithoutClassNestedInput
    students?: StudentUpdateManyWithoutClassNestedInput
  }

  export type ClassUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjects?: SubjectUncheckedUpdateManyWithoutClassNestedInput
    students?: StudentUncheckedUpdateManyWithoutClassNestedInput
  }

  export type ClassCreateManyInput = {
    id?: number
    uuid?: string
    branch_uuid: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ClassUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjectCreateInput = {
    uuid?: string
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    class?: ClassCreateNestedOneWithoutSubjectsInput
  }

  export type SubjectUncheckedCreateInput = {
    id?: number
    uuid?: string
    class_uuid: string
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubjectUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class?: ClassUpdateOneWithoutSubjectsNestedInput
  }

  export type SubjectUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    class_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjectCreateManyInput = {
    id?: number
    uuid?: string
    class_uuid: string
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubjectUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjectUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    class_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradeCreateInput = {
    uuid?: string
    score: number
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
    branch?: BranchCreateNestedOneWithoutGradesInput
  }

  export type GradeUncheckedCreateInput = {
    id?: number
    uuid?: string
    branch_uuid: string
    score: number
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GradeUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    branch?: BranchUpdateOneWithoutGradesNestedInput
  }

  export type GradeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradeCreateManyInput = {
    id?: number
    uuid?: string
    branch_uuid: string
    score: number
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GradeUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResultCreateInput = {
    uuid?: string
    class_name: string
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
    student?: StudentCreateNestedOneWithoutResultsInput
    assessments?: AssessmentsCreateNestedManyWithoutResultInput
  }

  export type ResultUncheckedCreateInput = {
    id?: number
    uuid?: string
    student_uuid: string
    class_name: string
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
    assessments?: AssessmentsUncheckedCreateNestedManyWithoutResultInput
  }

  export type ResultUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    class_name?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutResultsNestedInput
    assessments?: AssessmentsUpdateManyWithoutResultNestedInput
  }

  export type ResultUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    student_uuid?: StringFieldUpdateOperationsInput | string
    class_name?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    assessments?: AssessmentsUncheckedUpdateManyWithoutResultNestedInput
  }

  export type ResultCreateManyInput = {
    id?: number
    uuid?: string
    student_uuid: string
    class_name: string
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ResultUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    class_name?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResultUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    student_uuid?: StringFieldUpdateOperationsInput | string
    class_name?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentsCreateInput = {
    uuid?: string
    subject: string
    assignment: number
    assesment: number
    examination: number
    overall: number
    grade: string
    created_at?: Date | string
    updated_at?: Date | string
    result?: ResultCreateNestedOneWithoutAssessmentsInput
  }

  export type AssessmentsUncheckedCreateInput = {
    id?: number
    uuid?: string
    result_uuid: string
    subject: string
    assignment: number
    assesment: number
    examination: number
    overall: number
    grade: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AssessmentsUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    assignment?: FloatFieldUpdateOperationsInput | number
    assesment?: FloatFieldUpdateOperationsInput | number
    examination?: FloatFieldUpdateOperationsInput | number
    overall?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: ResultUpdateOneWithoutAssessmentsNestedInput
  }

  export type AssessmentsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    result_uuid?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    assignment?: FloatFieldUpdateOperationsInput | number
    assesment?: FloatFieldUpdateOperationsInput | number
    examination?: FloatFieldUpdateOperationsInput | number
    overall?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentsCreateManyInput = {
    id?: number
    uuid?: string
    result_uuid: string
    subject: string
    assignment: number
    assesment: number
    examination: number
    overall: number
    grade: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AssessmentsUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    assignment?: FloatFieldUpdateOperationsInput | number
    assesment?: FloatFieldUpdateOperationsInput | number
    examination?: FloatFieldUpdateOperationsInput | number
    overall?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    result_uuid?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    assignment?: FloatFieldUpdateOperationsInput | number
    assesment?: FloatFieldUpdateOperationsInput | number
    examination?: FloatFieldUpdateOperationsInput | number
    overall?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SchoolNullableScalarRelationFilter = {
    is?: SchoolWhereInput | null
    isNot?: SchoolWhereInput | null
  }

  export type StudentListRelationFilter = {
    every?: StudentWhereInput
    some?: StudentWhereInput
    none?: StudentWhereInput
  }

  export type BranchAccessListRelationFilter = {
    every?: BranchAccessWhereInput
    some?: BranchAccessWhereInput
    none?: BranchAccessWhereInput
  }

  export type AccessControlListRelationFilter = {
    every?: AccessControlWhereInput
    some?: AccessControlWhereInput
    none?: AccessControlWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StudentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BranchAccessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccessControlOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserSchool_uuidEmailRoleCompoundUniqueInput = {
    school_uuid: string
    email: string
    role: $Enums.Role
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    contact?: SortOrder
    alt_contact?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    role?: SortOrder
    position?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    contact?: SortOrder
    alt_contact?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    role?: SortOrder
    position?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    contact?: SortOrder
    alt_contact?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    role?: SortOrder
    position?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type BranchNullableScalarRelationFilter = {
    is?: BranchWhereInput | null
    isNot?: BranchWhereInput | null
  }

  export type AccessControlUser_uuidBranch_uuidAccessCompoundUniqueInput = {
    user_uuid: string
    branch_uuid: string
    access: string
  }

  export type AccessControlCountOrderByAggregateInput = {
    id?: SortOrder
    user_uuid?: SortOrder
    branch_uuid?: SortOrder
    access?: SortOrder
  }

  export type AccessControlAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AccessControlMaxOrderByAggregateInput = {
    id?: SortOrder
    user_uuid?: SortOrder
    branch_uuid?: SortOrder
    access?: SortOrder
  }

  export type AccessControlMinOrderByAggregateInput = {
    id?: SortOrder
    user_uuid?: SortOrder
    branch_uuid?: SortOrder
    access?: SortOrder
  }

  export type AccessControlSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type BranchListRelationFilter = {
    every?: BranchWhereInput
    some?: BranchWhereInput
    none?: BranchWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BranchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SchoolCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    token?: SortOrder
    email?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    contact?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    zip?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SchoolAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SchoolMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    token?: SortOrder
    email?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    contact?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    zip?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SchoolMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    token?: SortOrder
    email?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    contact?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    zip?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SchoolSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type GradeListRelationFilter = {
    every?: GradeWhereInput
    some?: GradeWhereInput
    none?: GradeWhereInput
  }

  export type ClassListRelationFilter = {
    every?: ClassWhereInput
    some?: ClassWhereInput
    none?: ClassWhereInput
  }

  export type SchoolScalarRelationFilter = {
    is?: SchoolWhereInput
    isNot?: SchoolWhereInput
  }

  export type GradeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClassOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BranchCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contact?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BranchAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BranchMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contact?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BranchMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    school_uuid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contact?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BranchSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BranchAccessUser_uuidBranch_uuidRoleCompoundUniqueInput = {
    user_uuid: string
    branch_uuid: string
    role: $Enums.Role
  }

  export type BranchAccessCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    user_uuid?: SortOrder
    school_uuid?: SortOrder
    branch_uuid?: SortOrder
  }

  export type BranchAccessAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BranchAccessMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    user_uuid?: SortOrder
    school_uuid?: SortOrder
    branch_uuid?: SortOrder
  }

  export type BranchAccessMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    user_uuid?: SortOrder
    school_uuid?: SortOrder
    branch_uuid?: SortOrder
  }

  export type BranchAccessSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type BranchScalarRelationFilter = {
    is?: BranchWhereInput
    isNot?: BranchWhereInput
  }

  export type ClassScalarRelationFilter = {
    is?: ClassWhereInput
    isNot?: ClassWhereInput
  }

  export type ResultListRelationFilter = {
    every?: ResultWhereInput
    some?: ResultWhereInput
    none?: ResultWhereInput
  }

  export type ResultOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentBranch_uuidReg_numberCompoundUniqueInput = {
    branch_uuid: string
    reg_number: string
  }

  export type StudentCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    parent_uuid?: SortOrder
    branch_uuid?: SortOrder
    class_uuid?: SortOrder
    reg_number?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type StudentAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StudentMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    parent_uuid?: SortOrder
    branch_uuid?: SortOrder
    class_uuid?: SortOrder
    reg_number?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type StudentMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    parent_uuid?: SortOrder
    branch_uuid?: SortOrder
    class_uuid?: SortOrder
    reg_number?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type StudentSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SubjectListRelationFilter = {
    every?: SubjectWhereInput
    some?: SubjectWhereInput
    none?: SubjectWhereInput
  }

  export type SubjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClassCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    name?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ClassAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ClassMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    name?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ClassMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    name?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ClassSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ClassNullableScalarRelationFilter = {
    is?: ClassWhereInput | null
    isNot?: ClassWhereInput | null
  }

  export type SubjectCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    class_uuid?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubjectAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SubjectMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    class_uuid?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubjectMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    class_uuid?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubjectSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type GradeCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    score?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GradeAvgOrderByAggregateInput = {
    id?: SortOrder
    score?: SortOrder
  }

  export type GradeMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    score?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GradeMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    branch_uuid?: SortOrder
    score?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GradeSumOrderByAggregateInput = {
    id?: SortOrder
    score?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type StudentNullableScalarRelationFilter = {
    is?: StudentWhereInput | null
    isNot?: StudentWhereInput | null
  }

  export type AssessmentsListRelationFilter = {
    every?: AssessmentsWhereInput
    some?: AssessmentsWhereInput
    none?: AssessmentsWhereInput
  }

  export type AssessmentsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ResultCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    student_uuid?: SortOrder
    class_name?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ResultAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ResultMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    student_uuid?: SortOrder
    class_name?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ResultMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    student_uuid?: SortOrder
    class_name?: SortOrder
    grade?: SortOrder
    remark?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ResultSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ResultNullableScalarRelationFilter = {
    is?: ResultWhereInput | null
    isNot?: ResultWhereInput | null
  }

  export type AssessmentsResult_uuidSubjectCompoundUniqueInput = {
    result_uuid: string
    subject: string
  }

  export type AssessmentsCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    result_uuid?: SortOrder
    subject?: SortOrder
    assignment?: SortOrder
    assesment?: SortOrder
    examination?: SortOrder
    overall?: SortOrder
    grade?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type AssessmentsAvgOrderByAggregateInput = {
    id?: SortOrder
    assignment?: SortOrder
    assesment?: SortOrder
    examination?: SortOrder
    overall?: SortOrder
  }

  export type AssessmentsMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    result_uuid?: SortOrder
    subject?: SortOrder
    assignment?: SortOrder
    assesment?: SortOrder
    examination?: SortOrder
    overall?: SortOrder
    grade?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type AssessmentsMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    result_uuid?: SortOrder
    subject?: SortOrder
    assignment?: SortOrder
    assesment?: SortOrder
    examination?: SortOrder
    overall?: SortOrder
    grade?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type AssessmentsSumOrderByAggregateInput = {
    id?: SortOrder
    assignment?: SortOrder
    assesment?: SortOrder
    examination?: SortOrder
    overall?: SortOrder
  }

  export type SchoolCreateNestedOneWithoutUsersInput = {
    create?: XOR<SchoolCreateWithoutUsersInput, SchoolUncheckedCreateWithoutUsersInput>
    connectOrCreate?: SchoolCreateOrConnectWithoutUsersInput
    connect?: SchoolWhereUniqueInput
  }

  export type StudentCreateNestedManyWithoutParentInput = {
    create?: XOR<StudentCreateWithoutParentInput, StudentUncheckedCreateWithoutParentInput> | StudentCreateWithoutParentInput[] | StudentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutParentInput | StudentCreateOrConnectWithoutParentInput[]
    createMany?: StudentCreateManyParentInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type BranchAccessCreateNestedManyWithoutUserInput = {
    create?: XOR<BranchAccessCreateWithoutUserInput, BranchAccessUncheckedCreateWithoutUserInput> | BranchAccessCreateWithoutUserInput[] | BranchAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutUserInput | BranchAccessCreateOrConnectWithoutUserInput[]
    createMany?: BranchAccessCreateManyUserInputEnvelope
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
  }

  export type AccessControlCreateNestedManyWithoutUserInput = {
    create?: XOR<AccessControlCreateWithoutUserInput, AccessControlUncheckedCreateWithoutUserInput> | AccessControlCreateWithoutUserInput[] | AccessControlUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccessControlCreateOrConnectWithoutUserInput | AccessControlCreateOrConnectWithoutUserInput[]
    createMany?: AccessControlCreateManyUserInputEnvelope
    connect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
  }

  export type StudentUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<StudentCreateWithoutParentInput, StudentUncheckedCreateWithoutParentInput> | StudentCreateWithoutParentInput[] | StudentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutParentInput | StudentCreateOrConnectWithoutParentInput[]
    createMany?: StudentCreateManyParentInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type BranchAccessUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BranchAccessCreateWithoutUserInput, BranchAccessUncheckedCreateWithoutUserInput> | BranchAccessCreateWithoutUserInput[] | BranchAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutUserInput | BranchAccessCreateOrConnectWithoutUserInput[]
    createMany?: BranchAccessCreateManyUserInputEnvelope
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
  }

  export type AccessControlUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccessControlCreateWithoutUserInput, AccessControlUncheckedCreateWithoutUserInput> | AccessControlCreateWithoutUserInput[] | AccessControlUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccessControlCreateOrConnectWithoutUserInput | AccessControlCreateOrConnectWithoutUserInput[]
    createMany?: AccessControlCreateManyUserInputEnvelope
    connect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SchoolUpdateOneWithoutUsersNestedInput = {
    create?: XOR<SchoolCreateWithoutUsersInput, SchoolUncheckedCreateWithoutUsersInput>
    connectOrCreate?: SchoolCreateOrConnectWithoutUsersInput
    upsert?: SchoolUpsertWithoutUsersInput
    disconnect?: SchoolWhereInput | boolean
    delete?: SchoolWhereInput | boolean
    connect?: SchoolWhereUniqueInput
    update?: XOR<XOR<SchoolUpdateToOneWithWhereWithoutUsersInput, SchoolUpdateWithoutUsersInput>, SchoolUncheckedUpdateWithoutUsersInput>
  }

  export type StudentUpdateManyWithoutParentNestedInput = {
    create?: XOR<StudentCreateWithoutParentInput, StudentUncheckedCreateWithoutParentInput> | StudentCreateWithoutParentInput[] | StudentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutParentInput | StudentCreateOrConnectWithoutParentInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutParentInput | StudentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: StudentCreateManyParentInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutParentInput | StudentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutParentInput | StudentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type BranchAccessUpdateManyWithoutUserNestedInput = {
    create?: XOR<BranchAccessCreateWithoutUserInput, BranchAccessUncheckedCreateWithoutUserInput> | BranchAccessCreateWithoutUserInput[] | BranchAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutUserInput | BranchAccessCreateOrConnectWithoutUserInput[]
    upsert?: BranchAccessUpsertWithWhereUniqueWithoutUserInput | BranchAccessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BranchAccessCreateManyUserInputEnvelope
    set?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    disconnect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    delete?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    update?: BranchAccessUpdateWithWhereUniqueWithoutUserInput | BranchAccessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BranchAccessUpdateManyWithWhereWithoutUserInput | BranchAccessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BranchAccessScalarWhereInput | BranchAccessScalarWhereInput[]
  }

  export type AccessControlUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccessControlCreateWithoutUserInput, AccessControlUncheckedCreateWithoutUserInput> | AccessControlCreateWithoutUserInput[] | AccessControlUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccessControlCreateOrConnectWithoutUserInput | AccessControlCreateOrConnectWithoutUserInput[]
    upsert?: AccessControlUpsertWithWhereUniqueWithoutUserInput | AccessControlUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccessControlCreateManyUserInputEnvelope
    set?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    disconnect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    delete?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    connect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    update?: AccessControlUpdateWithWhereUniqueWithoutUserInput | AccessControlUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccessControlUpdateManyWithWhereWithoutUserInput | AccessControlUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccessControlScalarWhereInput | AccessControlScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StudentUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<StudentCreateWithoutParentInput, StudentUncheckedCreateWithoutParentInput> | StudentCreateWithoutParentInput[] | StudentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutParentInput | StudentCreateOrConnectWithoutParentInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutParentInput | StudentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: StudentCreateManyParentInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutParentInput | StudentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutParentInput | StudentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type BranchAccessUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BranchAccessCreateWithoutUserInput, BranchAccessUncheckedCreateWithoutUserInput> | BranchAccessCreateWithoutUserInput[] | BranchAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutUserInput | BranchAccessCreateOrConnectWithoutUserInput[]
    upsert?: BranchAccessUpsertWithWhereUniqueWithoutUserInput | BranchAccessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BranchAccessCreateManyUserInputEnvelope
    set?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    disconnect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    delete?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    update?: BranchAccessUpdateWithWhereUniqueWithoutUserInput | BranchAccessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BranchAccessUpdateManyWithWhereWithoutUserInput | BranchAccessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BranchAccessScalarWhereInput | BranchAccessScalarWhereInput[]
  }

  export type AccessControlUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccessControlCreateWithoutUserInput, AccessControlUncheckedCreateWithoutUserInput> | AccessControlCreateWithoutUserInput[] | AccessControlUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccessControlCreateOrConnectWithoutUserInput | AccessControlCreateOrConnectWithoutUserInput[]
    upsert?: AccessControlUpsertWithWhereUniqueWithoutUserInput | AccessControlUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccessControlCreateManyUserInputEnvelope
    set?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    disconnect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    delete?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    connect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    update?: AccessControlUpdateWithWhereUniqueWithoutUserInput | AccessControlUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccessControlUpdateManyWithWhereWithoutUserInput | AccessControlUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccessControlScalarWhereInput | AccessControlScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutControlInput = {
    create?: XOR<UserCreateWithoutControlInput, UserUncheckedCreateWithoutControlInput>
    connectOrCreate?: UserCreateOrConnectWithoutControlInput
    connect?: UserWhereUniqueInput
  }

  export type BranchCreateNestedOneWithoutControlInput = {
    create?: XOR<BranchCreateWithoutControlInput, BranchUncheckedCreateWithoutControlInput>
    connectOrCreate?: BranchCreateOrConnectWithoutControlInput
    connect?: BranchWhereUniqueInput
  }

  export type UserUpdateOneWithoutControlNestedInput = {
    create?: XOR<UserCreateWithoutControlInput, UserUncheckedCreateWithoutControlInput>
    connectOrCreate?: UserCreateOrConnectWithoutControlInput
    upsert?: UserUpsertWithoutControlInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutControlInput, UserUpdateWithoutControlInput>, UserUncheckedUpdateWithoutControlInput>
  }

  export type BranchUpdateOneWithoutControlNestedInput = {
    create?: XOR<BranchCreateWithoutControlInput, BranchUncheckedCreateWithoutControlInput>
    connectOrCreate?: BranchCreateOrConnectWithoutControlInput
    upsert?: BranchUpsertWithoutControlInput
    disconnect?: BranchWhereInput | boolean
    delete?: BranchWhereInput | boolean
    connect?: BranchWhereUniqueInput
    update?: XOR<XOR<BranchUpdateToOneWithWhereWithoutControlInput, BranchUpdateWithoutControlInput>, BranchUncheckedUpdateWithoutControlInput>
  }

  export type UserCreateNestedManyWithoutSchoolInput = {
    create?: XOR<UserCreateWithoutSchoolInput, UserUncheckedCreateWithoutSchoolInput> | UserCreateWithoutSchoolInput[] | UserUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSchoolInput | UserCreateOrConnectWithoutSchoolInput[]
    createMany?: UserCreateManySchoolInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type BranchCreateNestedManyWithoutSchoolInput = {
    create?: XOR<BranchCreateWithoutSchoolInput, BranchUncheckedCreateWithoutSchoolInput> | BranchCreateWithoutSchoolInput[] | BranchUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: BranchCreateOrConnectWithoutSchoolInput | BranchCreateOrConnectWithoutSchoolInput[]
    createMany?: BranchCreateManySchoolInputEnvelope
    connect?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
  }

  export type BranchAccessCreateNestedManyWithoutSchoolInput = {
    create?: XOR<BranchAccessCreateWithoutSchoolInput, BranchAccessUncheckedCreateWithoutSchoolInput> | BranchAccessCreateWithoutSchoolInput[] | BranchAccessUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutSchoolInput | BranchAccessCreateOrConnectWithoutSchoolInput[]
    createMany?: BranchAccessCreateManySchoolInputEnvelope
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutSchoolInput = {
    create?: XOR<UserCreateWithoutSchoolInput, UserUncheckedCreateWithoutSchoolInput> | UserCreateWithoutSchoolInput[] | UserUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSchoolInput | UserCreateOrConnectWithoutSchoolInput[]
    createMany?: UserCreateManySchoolInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type BranchUncheckedCreateNestedManyWithoutSchoolInput = {
    create?: XOR<BranchCreateWithoutSchoolInput, BranchUncheckedCreateWithoutSchoolInput> | BranchCreateWithoutSchoolInput[] | BranchUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: BranchCreateOrConnectWithoutSchoolInput | BranchCreateOrConnectWithoutSchoolInput[]
    createMany?: BranchCreateManySchoolInputEnvelope
    connect?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
  }

  export type BranchAccessUncheckedCreateNestedManyWithoutSchoolInput = {
    create?: XOR<BranchAccessCreateWithoutSchoolInput, BranchAccessUncheckedCreateWithoutSchoolInput> | BranchAccessCreateWithoutSchoolInput[] | BranchAccessUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutSchoolInput | BranchAccessCreateOrConnectWithoutSchoolInput[]
    createMany?: BranchAccessCreateManySchoolInputEnvelope
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutSchoolNestedInput = {
    create?: XOR<UserCreateWithoutSchoolInput, UserUncheckedCreateWithoutSchoolInput> | UserCreateWithoutSchoolInput[] | UserUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSchoolInput | UserCreateOrConnectWithoutSchoolInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSchoolInput | UserUpsertWithWhereUniqueWithoutSchoolInput[]
    createMany?: UserCreateManySchoolInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSchoolInput | UserUpdateWithWhereUniqueWithoutSchoolInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSchoolInput | UserUpdateManyWithWhereWithoutSchoolInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type BranchUpdateManyWithoutSchoolNestedInput = {
    create?: XOR<BranchCreateWithoutSchoolInput, BranchUncheckedCreateWithoutSchoolInput> | BranchCreateWithoutSchoolInput[] | BranchUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: BranchCreateOrConnectWithoutSchoolInput | BranchCreateOrConnectWithoutSchoolInput[]
    upsert?: BranchUpsertWithWhereUniqueWithoutSchoolInput | BranchUpsertWithWhereUniqueWithoutSchoolInput[]
    createMany?: BranchCreateManySchoolInputEnvelope
    set?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
    disconnect?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
    delete?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
    connect?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
    update?: BranchUpdateWithWhereUniqueWithoutSchoolInput | BranchUpdateWithWhereUniqueWithoutSchoolInput[]
    updateMany?: BranchUpdateManyWithWhereWithoutSchoolInput | BranchUpdateManyWithWhereWithoutSchoolInput[]
    deleteMany?: BranchScalarWhereInput | BranchScalarWhereInput[]
  }

  export type BranchAccessUpdateManyWithoutSchoolNestedInput = {
    create?: XOR<BranchAccessCreateWithoutSchoolInput, BranchAccessUncheckedCreateWithoutSchoolInput> | BranchAccessCreateWithoutSchoolInput[] | BranchAccessUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutSchoolInput | BranchAccessCreateOrConnectWithoutSchoolInput[]
    upsert?: BranchAccessUpsertWithWhereUniqueWithoutSchoolInput | BranchAccessUpsertWithWhereUniqueWithoutSchoolInput[]
    createMany?: BranchAccessCreateManySchoolInputEnvelope
    set?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    disconnect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    delete?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    update?: BranchAccessUpdateWithWhereUniqueWithoutSchoolInput | BranchAccessUpdateWithWhereUniqueWithoutSchoolInput[]
    updateMany?: BranchAccessUpdateManyWithWhereWithoutSchoolInput | BranchAccessUpdateManyWithWhereWithoutSchoolInput[]
    deleteMany?: BranchAccessScalarWhereInput | BranchAccessScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutSchoolNestedInput = {
    create?: XOR<UserCreateWithoutSchoolInput, UserUncheckedCreateWithoutSchoolInput> | UserCreateWithoutSchoolInput[] | UserUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSchoolInput | UserCreateOrConnectWithoutSchoolInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSchoolInput | UserUpsertWithWhereUniqueWithoutSchoolInput[]
    createMany?: UserCreateManySchoolInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSchoolInput | UserUpdateWithWhereUniqueWithoutSchoolInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSchoolInput | UserUpdateManyWithWhereWithoutSchoolInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type BranchUncheckedUpdateManyWithoutSchoolNestedInput = {
    create?: XOR<BranchCreateWithoutSchoolInput, BranchUncheckedCreateWithoutSchoolInput> | BranchCreateWithoutSchoolInput[] | BranchUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: BranchCreateOrConnectWithoutSchoolInput | BranchCreateOrConnectWithoutSchoolInput[]
    upsert?: BranchUpsertWithWhereUniqueWithoutSchoolInput | BranchUpsertWithWhereUniqueWithoutSchoolInput[]
    createMany?: BranchCreateManySchoolInputEnvelope
    set?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
    disconnect?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
    delete?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
    connect?: BranchWhereUniqueInput | BranchWhereUniqueInput[]
    update?: BranchUpdateWithWhereUniqueWithoutSchoolInput | BranchUpdateWithWhereUniqueWithoutSchoolInput[]
    updateMany?: BranchUpdateManyWithWhereWithoutSchoolInput | BranchUpdateManyWithWhereWithoutSchoolInput[]
    deleteMany?: BranchScalarWhereInput | BranchScalarWhereInput[]
  }

  export type BranchAccessUncheckedUpdateManyWithoutSchoolNestedInput = {
    create?: XOR<BranchAccessCreateWithoutSchoolInput, BranchAccessUncheckedCreateWithoutSchoolInput> | BranchAccessCreateWithoutSchoolInput[] | BranchAccessUncheckedCreateWithoutSchoolInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutSchoolInput | BranchAccessCreateOrConnectWithoutSchoolInput[]
    upsert?: BranchAccessUpsertWithWhereUniqueWithoutSchoolInput | BranchAccessUpsertWithWhereUniqueWithoutSchoolInput[]
    createMany?: BranchAccessCreateManySchoolInputEnvelope
    set?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    disconnect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    delete?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    update?: BranchAccessUpdateWithWhereUniqueWithoutSchoolInput | BranchAccessUpdateWithWhereUniqueWithoutSchoolInput[]
    updateMany?: BranchAccessUpdateManyWithWhereWithoutSchoolInput | BranchAccessUpdateManyWithWhereWithoutSchoolInput[]
    deleteMany?: BranchAccessScalarWhereInput | BranchAccessScalarWhereInput[]
  }

  export type GradeCreateNestedManyWithoutBranchInput = {
    create?: XOR<GradeCreateWithoutBranchInput, GradeUncheckedCreateWithoutBranchInput> | GradeCreateWithoutBranchInput[] | GradeUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: GradeCreateOrConnectWithoutBranchInput | GradeCreateOrConnectWithoutBranchInput[]
    createMany?: GradeCreateManyBranchInputEnvelope
    connect?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
  }

  export type ClassCreateNestedManyWithoutBranchInput = {
    create?: XOR<ClassCreateWithoutBranchInput, ClassUncheckedCreateWithoutBranchInput> | ClassCreateWithoutBranchInput[] | ClassUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: ClassCreateOrConnectWithoutBranchInput | ClassCreateOrConnectWithoutBranchInput[]
    createMany?: ClassCreateManyBranchInputEnvelope
    connect?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
  }

  export type StudentCreateNestedManyWithoutBranchInput = {
    create?: XOR<StudentCreateWithoutBranchInput, StudentUncheckedCreateWithoutBranchInput> | StudentCreateWithoutBranchInput[] | StudentUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutBranchInput | StudentCreateOrConnectWithoutBranchInput[]
    createMany?: StudentCreateManyBranchInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type AccessControlCreateNestedManyWithoutBranchInput = {
    create?: XOR<AccessControlCreateWithoutBranchInput, AccessControlUncheckedCreateWithoutBranchInput> | AccessControlCreateWithoutBranchInput[] | AccessControlUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: AccessControlCreateOrConnectWithoutBranchInput | AccessControlCreateOrConnectWithoutBranchInput[]
    createMany?: AccessControlCreateManyBranchInputEnvelope
    connect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
  }

  export type BranchAccessCreateNestedManyWithoutBranchInput = {
    create?: XOR<BranchAccessCreateWithoutBranchInput, BranchAccessUncheckedCreateWithoutBranchInput> | BranchAccessCreateWithoutBranchInput[] | BranchAccessUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutBranchInput | BranchAccessCreateOrConnectWithoutBranchInput[]
    createMany?: BranchAccessCreateManyBranchInputEnvelope
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
  }

  export type SchoolCreateNestedOneWithoutBranchesInput = {
    create?: XOR<SchoolCreateWithoutBranchesInput, SchoolUncheckedCreateWithoutBranchesInput>
    connectOrCreate?: SchoolCreateOrConnectWithoutBranchesInput
    connect?: SchoolWhereUniqueInput
  }

  export type GradeUncheckedCreateNestedManyWithoutBranchInput = {
    create?: XOR<GradeCreateWithoutBranchInput, GradeUncheckedCreateWithoutBranchInput> | GradeCreateWithoutBranchInput[] | GradeUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: GradeCreateOrConnectWithoutBranchInput | GradeCreateOrConnectWithoutBranchInput[]
    createMany?: GradeCreateManyBranchInputEnvelope
    connect?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
  }

  export type ClassUncheckedCreateNestedManyWithoutBranchInput = {
    create?: XOR<ClassCreateWithoutBranchInput, ClassUncheckedCreateWithoutBranchInput> | ClassCreateWithoutBranchInput[] | ClassUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: ClassCreateOrConnectWithoutBranchInput | ClassCreateOrConnectWithoutBranchInput[]
    createMany?: ClassCreateManyBranchInputEnvelope
    connect?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
  }

  export type StudentUncheckedCreateNestedManyWithoutBranchInput = {
    create?: XOR<StudentCreateWithoutBranchInput, StudentUncheckedCreateWithoutBranchInput> | StudentCreateWithoutBranchInput[] | StudentUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutBranchInput | StudentCreateOrConnectWithoutBranchInput[]
    createMany?: StudentCreateManyBranchInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type AccessControlUncheckedCreateNestedManyWithoutBranchInput = {
    create?: XOR<AccessControlCreateWithoutBranchInput, AccessControlUncheckedCreateWithoutBranchInput> | AccessControlCreateWithoutBranchInput[] | AccessControlUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: AccessControlCreateOrConnectWithoutBranchInput | AccessControlCreateOrConnectWithoutBranchInput[]
    createMany?: AccessControlCreateManyBranchInputEnvelope
    connect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
  }

  export type BranchAccessUncheckedCreateNestedManyWithoutBranchInput = {
    create?: XOR<BranchAccessCreateWithoutBranchInput, BranchAccessUncheckedCreateWithoutBranchInput> | BranchAccessCreateWithoutBranchInput[] | BranchAccessUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutBranchInput | BranchAccessCreateOrConnectWithoutBranchInput[]
    createMany?: BranchAccessCreateManyBranchInputEnvelope
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
  }

  export type GradeUpdateManyWithoutBranchNestedInput = {
    create?: XOR<GradeCreateWithoutBranchInput, GradeUncheckedCreateWithoutBranchInput> | GradeCreateWithoutBranchInput[] | GradeUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: GradeCreateOrConnectWithoutBranchInput | GradeCreateOrConnectWithoutBranchInput[]
    upsert?: GradeUpsertWithWhereUniqueWithoutBranchInput | GradeUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: GradeCreateManyBranchInputEnvelope
    set?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
    disconnect?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
    delete?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
    connect?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
    update?: GradeUpdateWithWhereUniqueWithoutBranchInput | GradeUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: GradeUpdateManyWithWhereWithoutBranchInput | GradeUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: GradeScalarWhereInput | GradeScalarWhereInput[]
  }

  export type ClassUpdateManyWithoutBranchNestedInput = {
    create?: XOR<ClassCreateWithoutBranchInput, ClassUncheckedCreateWithoutBranchInput> | ClassCreateWithoutBranchInput[] | ClassUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: ClassCreateOrConnectWithoutBranchInput | ClassCreateOrConnectWithoutBranchInput[]
    upsert?: ClassUpsertWithWhereUniqueWithoutBranchInput | ClassUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: ClassCreateManyBranchInputEnvelope
    set?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
    disconnect?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
    delete?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
    connect?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
    update?: ClassUpdateWithWhereUniqueWithoutBranchInput | ClassUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: ClassUpdateManyWithWhereWithoutBranchInput | ClassUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: ClassScalarWhereInput | ClassScalarWhereInput[]
  }

  export type StudentUpdateManyWithoutBranchNestedInput = {
    create?: XOR<StudentCreateWithoutBranchInput, StudentUncheckedCreateWithoutBranchInput> | StudentCreateWithoutBranchInput[] | StudentUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutBranchInput | StudentCreateOrConnectWithoutBranchInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutBranchInput | StudentUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: StudentCreateManyBranchInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutBranchInput | StudentUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutBranchInput | StudentUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type AccessControlUpdateManyWithoutBranchNestedInput = {
    create?: XOR<AccessControlCreateWithoutBranchInput, AccessControlUncheckedCreateWithoutBranchInput> | AccessControlCreateWithoutBranchInput[] | AccessControlUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: AccessControlCreateOrConnectWithoutBranchInput | AccessControlCreateOrConnectWithoutBranchInput[]
    upsert?: AccessControlUpsertWithWhereUniqueWithoutBranchInput | AccessControlUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: AccessControlCreateManyBranchInputEnvelope
    set?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    disconnect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    delete?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    connect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    update?: AccessControlUpdateWithWhereUniqueWithoutBranchInput | AccessControlUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: AccessControlUpdateManyWithWhereWithoutBranchInput | AccessControlUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: AccessControlScalarWhereInput | AccessControlScalarWhereInput[]
  }

  export type BranchAccessUpdateManyWithoutBranchNestedInput = {
    create?: XOR<BranchAccessCreateWithoutBranchInput, BranchAccessUncheckedCreateWithoutBranchInput> | BranchAccessCreateWithoutBranchInput[] | BranchAccessUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutBranchInput | BranchAccessCreateOrConnectWithoutBranchInput[]
    upsert?: BranchAccessUpsertWithWhereUniqueWithoutBranchInput | BranchAccessUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: BranchAccessCreateManyBranchInputEnvelope
    set?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    disconnect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    delete?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    update?: BranchAccessUpdateWithWhereUniqueWithoutBranchInput | BranchAccessUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: BranchAccessUpdateManyWithWhereWithoutBranchInput | BranchAccessUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: BranchAccessScalarWhereInput | BranchAccessScalarWhereInput[]
  }

  export type SchoolUpdateOneRequiredWithoutBranchesNestedInput = {
    create?: XOR<SchoolCreateWithoutBranchesInput, SchoolUncheckedCreateWithoutBranchesInput>
    connectOrCreate?: SchoolCreateOrConnectWithoutBranchesInput
    upsert?: SchoolUpsertWithoutBranchesInput
    connect?: SchoolWhereUniqueInput
    update?: XOR<XOR<SchoolUpdateToOneWithWhereWithoutBranchesInput, SchoolUpdateWithoutBranchesInput>, SchoolUncheckedUpdateWithoutBranchesInput>
  }

  export type GradeUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: XOR<GradeCreateWithoutBranchInput, GradeUncheckedCreateWithoutBranchInput> | GradeCreateWithoutBranchInput[] | GradeUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: GradeCreateOrConnectWithoutBranchInput | GradeCreateOrConnectWithoutBranchInput[]
    upsert?: GradeUpsertWithWhereUniqueWithoutBranchInput | GradeUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: GradeCreateManyBranchInputEnvelope
    set?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
    disconnect?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
    delete?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
    connect?: GradeWhereUniqueInput | GradeWhereUniqueInput[]
    update?: GradeUpdateWithWhereUniqueWithoutBranchInput | GradeUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: GradeUpdateManyWithWhereWithoutBranchInput | GradeUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: GradeScalarWhereInput | GradeScalarWhereInput[]
  }

  export type ClassUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: XOR<ClassCreateWithoutBranchInput, ClassUncheckedCreateWithoutBranchInput> | ClassCreateWithoutBranchInput[] | ClassUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: ClassCreateOrConnectWithoutBranchInput | ClassCreateOrConnectWithoutBranchInput[]
    upsert?: ClassUpsertWithWhereUniqueWithoutBranchInput | ClassUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: ClassCreateManyBranchInputEnvelope
    set?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
    disconnect?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
    delete?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
    connect?: ClassWhereUniqueInput | ClassWhereUniqueInput[]
    update?: ClassUpdateWithWhereUniqueWithoutBranchInput | ClassUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: ClassUpdateManyWithWhereWithoutBranchInput | ClassUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: ClassScalarWhereInput | ClassScalarWhereInput[]
  }

  export type StudentUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: XOR<StudentCreateWithoutBranchInput, StudentUncheckedCreateWithoutBranchInput> | StudentCreateWithoutBranchInput[] | StudentUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutBranchInput | StudentCreateOrConnectWithoutBranchInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutBranchInput | StudentUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: StudentCreateManyBranchInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutBranchInput | StudentUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutBranchInput | StudentUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type AccessControlUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: XOR<AccessControlCreateWithoutBranchInput, AccessControlUncheckedCreateWithoutBranchInput> | AccessControlCreateWithoutBranchInput[] | AccessControlUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: AccessControlCreateOrConnectWithoutBranchInput | AccessControlCreateOrConnectWithoutBranchInput[]
    upsert?: AccessControlUpsertWithWhereUniqueWithoutBranchInput | AccessControlUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: AccessControlCreateManyBranchInputEnvelope
    set?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    disconnect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    delete?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    connect?: AccessControlWhereUniqueInput | AccessControlWhereUniqueInput[]
    update?: AccessControlUpdateWithWhereUniqueWithoutBranchInput | AccessControlUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: AccessControlUpdateManyWithWhereWithoutBranchInput | AccessControlUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: AccessControlScalarWhereInput | AccessControlScalarWhereInput[]
  }

  export type BranchAccessUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: XOR<BranchAccessCreateWithoutBranchInput, BranchAccessUncheckedCreateWithoutBranchInput> | BranchAccessCreateWithoutBranchInput[] | BranchAccessUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: BranchAccessCreateOrConnectWithoutBranchInput | BranchAccessCreateOrConnectWithoutBranchInput[]
    upsert?: BranchAccessUpsertWithWhereUniqueWithoutBranchInput | BranchAccessUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: BranchAccessCreateManyBranchInputEnvelope
    set?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    disconnect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    delete?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    connect?: BranchAccessWhereUniqueInput | BranchAccessWhereUniqueInput[]
    update?: BranchAccessUpdateWithWhereUniqueWithoutBranchInput | BranchAccessUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: BranchAccessUpdateManyWithWhereWithoutBranchInput | BranchAccessUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: BranchAccessScalarWhereInput | BranchAccessScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccessInput = {
    create?: XOR<UserCreateWithoutAccessInput, UserUncheckedCreateWithoutAccessInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccessInput
    connect?: UserWhereUniqueInput
  }

  export type SchoolCreateNestedOneWithoutAccessInput = {
    create?: XOR<SchoolCreateWithoutAccessInput, SchoolUncheckedCreateWithoutAccessInput>
    connectOrCreate?: SchoolCreateOrConnectWithoutAccessInput
    connect?: SchoolWhereUniqueInput
  }

  export type BranchCreateNestedOneWithoutAccessInput = {
    create?: XOR<BranchCreateWithoutAccessInput, BranchUncheckedCreateWithoutAccessInput>
    connectOrCreate?: BranchCreateOrConnectWithoutAccessInput
    connect?: BranchWhereUniqueInput
  }

  export type UserUpdateOneWithoutAccessNestedInput = {
    create?: XOR<UserCreateWithoutAccessInput, UserUncheckedCreateWithoutAccessInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccessInput
    upsert?: UserUpsertWithoutAccessInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccessInput, UserUpdateWithoutAccessInput>, UserUncheckedUpdateWithoutAccessInput>
  }

  export type SchoolUpdateOneWithoutAccessNestedInput = {
    create?: XOR<SchoolCreateWithoutAccessInput, SchoolUncheckedCreateWithoutAccessInput>
    connectOrCreate?: SchoolCreateOrConnectWithoutAccessInput
    upsert?: SchoolUpsertWithoutAccessInput
    disconnect?: SchoolWhereInput | boolean
    delete?: SchoolWhereInput | boolean
    connect?: SchoolWhereUniqueInput
    update?: XOR<XOR<SchoolUpdateToOneWithWhereWithoutAccessInput, SchoolUpdateWithoutAccessInput>, SchoolUncheckedUpdateWithoutAccessInput>
  }

  export type BranchUpdateOneWithoutAccessNestedInput = {
    create?: XOR<BranchCreateWithoutAccessInput, BranchUncheckedCreateWithoutAccessInput>
    connectOrCreate?: BranchCreateOrConnectWithoutAccessInput
    upsert?: BranchUpsertWithoutAccessInput
    disconnect?: BranchWhereInput | boolean
    delete?: BranchWhereInput | boolean
    connect?: BranchWhereUniqueInput
    update?: XOR<XOR<BranchUpdateToOneWithWhereWithoutAccessInput, BranchUpdateWithoutAccessInput>, BranchUncheckedUpdateWithoutAccessInput>
  }

  export type UserCreateNestedOneWithoutStudentsInput = {
    create?: XOR<UserCreateWithoutStudentsInput, UserUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentsInput
    connect?: UserWhereUniqueInput
  }

  export type BranchCreateNestedOneWithoutStudentsInput = {
    create?: XOR<BranchCreateWithoutStudentsInput, BranchUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: BranchCreateOrConnectWithoutStudentsInput
    connect?: BranchWhereUniqueInput
  }

  export type ClassCreateNestedOneWithoutStudentsInput = {
    create?: XOR<ClassCreateWithoutStudentsInput, ClassUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: ClassCreateOrConnectWithoutStudentsInput
    connect?: ClassWhereUniqueInput
  }

  export type ResultCreateNestedManyWithoutStudentInput = {
    create?: XOR<ResultCreateWithoutStudentInput, ResultUncheckedCreateWithoutStudentInput> | ResultCreateWithoutStudentInput[] | ResultUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ResultCreateOrConnectWithoutStudentInput | ResultCreateOrConnectWithoutStudentInput[]
    createMany?: ResultCreateManyStudentInputEnvelope
    connect?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
  }

  export type ResultUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<ResultCreateWithoutStudentInput, ResultUncheckedCreateWithoutStudentInput> | ResultCreateWithoutStudentInput[] | ResultUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ResultCreateOrConnectWithoutStudentInput | ResultCreateOrConnectWithoutStudentInput[]
    createMany?: ResultCreateManyStudentInputEnvelope
    connect?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutStudentsNestedInput = {
    create?: XOR<UserCreateWithoutStudentsInput, UserUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentsInput
    upsert?: UserUpsertWithoutStudentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStudentsInput, UserUpdateWithoutStudentsInput>, UserUncheckedUpdateWithoutStudentsInput>
  }

  export type BranchUpdateOneRequiredWithoutStudentsNestedInput = {
    create?: XOR<BranchCreateWithoutStudentsInput, BranchUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: BranchCreateOrConnectWithoutStudentsInput
    upsert?: BranchUpsertWithoutStudentsInput
    connect?: BranchWhereUniqueInput
    update?: XOR<XOR<BranchUpdateToOneWithWhereWithoutStudentsInput, BranchUpdateWithoutStudentsInput>, BranchUncheckedUpdateWithoutStudentsInput>
  }

  export type ClassUpdateOneRequiredWithoutStudentsNestedInput = {
    create?: XOR<ClassCreateWithoutStudentsInput, ClassUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: ClassCreateOrConnectWithoutStudentsInput
    upsert?: ClassUpsertWithoutStudentsInput
    connect?: ClassWhereUniqueInput
    update?: XOR<XOR<ClassUpdateToOneWithWhereWithoutStudentsInput, ClassUpdateWithoutStudentsInput>, ClassUncheckedUpdateWithoutStudentsInput>
  }

  export type ResultUpdateManyWithoutStudentNestedInput = {
    create?: XOR<ResultCreateWithoutStudentInput, ResultUncheckedCreateWithoutStudentInput> | ResultCreateWithoutStudentInput[] | ResultUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ResultCreateOrConnectWithoutStudentInput | ResultCreateOrConnectWithoutStudentInput[]
    upsert?: ResultUpsertWithWhereUniqueWithoutStudentInput | ResultUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: ResultCreateManyStudentInputEnvelope
    set?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
    disconnect?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
    delete?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
    connect?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
    update?: ResultUpdateWithWhereUniqueWithoutStudentInput | ResultUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: ResultUpdateManyWithWhereWithoutStudentInput | ResultUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: ResultScalarWhereInput | ResultScalarWhereInput[]
  }

  export type ResultUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<ResultCreateWithoutStudentInput, ResultUncheckedCreateWithoutStudentInput> | ResultCreateWithoutStudentInput[] | ResultUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ResultCreateOrConnectWithoutStudentInput | ResultCreateOrConnectWithoutStudentInput[]
    upsert?: ResultUpsertWithWhereUniqueWithoutStudentInput | ResultUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: ResultCreateManyStudentInputEnvelope
    set?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
    disconnect?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
    delete?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
    connect?: ResultWhereUniqueInput | ResultWhereUniqueInput[]
    update?: ResultUpdateWithWhereUniqueWithoutStudentInput | ResultUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: ResultUpdateManyWithWhereWithoutStudentInput | ResultUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: ResultScalarWhereInput | ResultScalarWhereInput[]
  }

  export type BranchCreateNestedOneWithoutClassesInput = {
    create?: XOR<BranchCreateWithoutClassesInput, BranchUncheckedCreateWithoutClassesInput>
    connectOrCreate?: BranchCreateOrConnectWithoutClassesInput
    connect?: BranchWhereUniqueInput
  }

  export type SubjectCreateNestedManyWithoutClassInput = {
    create?: XOR<SubjectCreateWithoutClassInput, SubjectUncheckedCreateWithoutClassInput> | SubjectCreateWithoutClassInput[] | SubjectUncheckedCreateWithoutClassInput[]
    connectOrCreate?: SubjectCreateOrConnectWithoutClassInput | SubjectCreateOrConnectWithoutClassInput[]
    createMany?: SubjectCreateManyClassInputEnvelope
    connect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
  }

  export type StudentCreateNestedManyWithoutClassInput = {
    create?: XOR<StudentCreateWithoutClassInput, StudentUncheckedCreateWithoutClassInput> | StudentCreateWithoutClassInput[] | StudentUncheckedCreateWithoutClassInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutClassInput | StudentCreateOrConnectWithoutClassInput[]
    createMany?: StudentCreateManyClassInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type SubjectUncheckedCreateNestedManyWithoutClassInput = {
    create?: XOR<SubjectCreateWithoutClassInput, SubjectUncheckedCreateWithoutClassInput> | SubjectCreateWithoutClassInput[] | SubjectUncheckedCreateWithoutClassInput[]
    connectOrCreate?: SubjectCreateOrConnectWithoutClassInput | SubjectCreateOrConnectWithoutClassInput[]
    createMany?: SubjectCreateManyClassInputEnvelope
    connect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
  }

  export type StudentUncheckedCreateNestedManyWithoutClassInput = {
    create?: XOR<StudentCreateWithoutClassInput, StudentUncheckedCreateWithoutClassInput> | StudentCreateWithoutClassInput[] | StudentUncheckedCreateWithoutClassInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutClassInput | StudentCreateOrConnectWithoutClassInput[]
    createMany?: StudentCreateManyClassInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type BranchUpdateOneWithoutClassesNestedInput = {
    create?: XOR<BranchCreateWithoutClassesInput, BranchUncheckedCreateWithoutClassesInput>
    connectOrCreate?: BranchCreateOrConnectWithoutClassesInput
    upsert?: BranchUpsertWithoutClassesInput
    disconnect?: BranchWhereInput | boolean
    delete?: BranchWhereInput | boolean
    connect?: BranchWhereUniqueInput
    update?: XOR<XOR<BranchUpdateToOneWithWhereWithoutClassesInput, BranchUpdateWithoutClassesInput>, BranchUncheckedUpdateWithoutClassesInput>
  }

  export type SubjectUpdateManyWithoutClassNestedInput = {
    create?: XOR<SubjectCreateWithoutClassInput, SubjectUncheckedCreateWithoutClassInput> | SubjectCreateWithoutClassInput[] | SubjectUncheckedCreateWithoutClassInput[]
    connectOrCreate?: SubjectCreateOrConnectWithoutClassInput | SubjectCreateOrConnectWithoutClassInput[]
    upsert?: SubjectUpsertWithWhereUniqueWithoutClassInput | SubjectUpsertWithWhereUniqueWithoutClassInput[]
    createMany?: SubjectCreateManyClassInputEnvelope
    set?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    disconnect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    delete?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    connect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    update?: SubjectUpdateWithWhereUniqueWithoutClassInput | SubjectUpdateWithWhereUniqueWithoutClassInput[]
    updateMany?: SubjectUpdateManyWithWhereWithoutClassInput | SubjectUpdateManyWithWhereWithoutClassInput[]
    deleteMany?: SubjectScalarWhereInput | SubjectScalarWhereInput[]
  }

  export type StudentUpdateManyWithoutClassNestedInput = {
    create?: XOR<StudentCreateWithoutClassInput, StudentUncheckedCreateWithoutClassInput> | StudentCreateWithoutClassInput[] | StudentUncheckedCreateWithoutClassInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutClassInput | StudentCreateOrConnectWithoutClassInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutClassInput | StudentUpsertWithWhereUniqueWithoutClassInput[]
    createMany?: StudentCreateManyClassInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutClassInput | StudentUpdateWithWhereUniqueWithoutClassInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutClassInput | StudentUpdateManyWithWhereWithoutClassInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type SubjectUncheckedUpdateManyWithoutClassNestedInput = {
    create?: XOR<SubjectCreateWithoutClassInput, SubjectUncheckedCreateWithoutClassInput> | SubjectCreateWithoutClassInput[] | SubjectUncheckedCreateWithoutClassInput[]
    connectOrCreate?: SubjectCreateOrConnectWithoutClassInput | SubjectCreateOrConnectWithoutClassInput[]
    upsert?: SubjectUpsertWithWhereUniqueWithoutClassInput | SubjectUpsertWithWhereUniqueWithoutClassInput[]
    createMany?: SubjectCreateManyClassInputEnvelope
    set?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    disconnect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    delete?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    connect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    update?: SubjectUpdateWithWhereUniqueWithoutClassInput | SubjectUpdateWithWhereUniqueWithoutClassInput[]
    updateMany?: SubjectUpdateManyWithWhereWithoutClassInput | SubjectUpdateManyWithWhereWithoutClassInput[]
    deleteMany?: SubjectScalarWhereInput | SubjectScalarWhereInput[]
  }

  export type StudentUncheckedUpdateManyWithoutClassNestedInput = {
    create?: XOR<StudentCreateWithoutClassInput, StudentUncheckedCreateWithoutClassInput> | StudentCreateWithoutClassInput[] | StudentUncheckedCreateWithoutClassInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutClassInput | StudentCreateOrConnectWithoutClassInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutClassInput | StudentUpsertWithWhereUniqueWithoutClassInput[]
    createMany?: StudentCreateManyClassInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutClassInput | StudentUpdateWithWhereUniqueWithoutClassInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutClassInput | StudentUpdateManyWithWhereWithoutClassInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type ClassCreateNestedOneWithoutSubjectsInput = {
    create?: XOR<ClassCreateWithoutSubjectsInput, ClassUncheckedCreateWithoutSubjectsInput>
    connectOrCreate?: ClassCreateOrConnectWithoutSubjectsInput
    connect?: ClassWhereUniqueInput
  }

  export type ClassUpdateOneWithoutSubjectsNestedInput = {
    create?: XOR<ClassCreateWithoutSubjectsInput, ClassUncheckedCreateWithoutSubjectsInput>
    connectOrCreate?: ClassCreateOrConnectWithoutSubjectsInput
    upsert?: ClassUpsertWithoutSubjectsInput
    disconnect?: ClassWhereInput | boolean
    delete?: ClassWhereInput | boolean
    connect?: ClassWhereUniqueInput
    update?: XOR<XOR<ClassUpdateToOneWithWhereWithoutSubjectsInput, ClassUpdateWithoutSubjectsInput>, ClassUncheckedUpdateWithoutSubjectsInput>
  }

  export type BranchCreateNestedOneWithoutGradesInput = {
    create?: XOR<BranchCreateWithoutGradesInput, BranchUncheckedCreateWithoutGradesInput>
    connectOrCreate?: BranchCreateOrConnectWithoutGradesInput
    connect?: BranchWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BranchUpdateOneWithoutGradesNestedInput = {
    create?: XOR<BranchCreateWithoutGradesInput, BranchUncheckedCreateWithoutGradesInput>
    connectOrCreate?: BranchCreateOrConnectWithoutGradesInput
    upsert?: BranchUpsertWithoutGradesInput
    disconnect?: BranchWhereInput | boolean
    delete?: BranchWhereInput | boolean
    connect?: BranchWhereUniqueInput
    update?: XOR<XOR<BranchUpdateToOneWithWhereWithoutGradesInput, BranchUpdateWithoutGradesInput>, BranchUncheckedUpdateWithoutGradesInput>
  }

  export type StudentCreateNestedOneWithoutResultsInput = {
    create?: XOR<StudentCreateWithoutResultsInput, StudentUncheckedCreateWithoutResultsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutResultsInput
    connect?: StudentWhereUniqueInput
  }

  export type AssessmentsCreateNestedManyWithoutResultInput = {
    create?: XOR<AssessmentsCreateWithoutResultInput, AssessmentsUncheckedCreateWithoutResultInput> | AssessmentsCreateWithoutResultInput[] | AssessmentsUncheckedCreateWithoutResultInput[]
    connectOrCreate?: AssessmentsCreateOrConnectWithoutResultInput | AssessmentsCreateOrConnectWithoutResultInput[]
    createMany?: AssessmentsCreateManyResultInputEnvelope
    connect?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
  }

  export type AssessmentsUncheckedCreateNestedManyWithoutResultInput = {
    create?: XOR<AssessmentsCreateWithoutResultInput, AssessmentsUncheckedCreateWithoutResultInput> | AssessmentsCreateWithoutResultInput[] | AssessmentsUncheckedCreateWithoutResultInput[]
    connectOrCreate?: AssessmentsCreateOrConnectWithoutResultInput | AssessmentsCreateOrConnectWithoutResultInput[]
    createMany?: AssessmentsCreateManyResultInputEnvelope
    connect?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
  }

  export type StudentUpdateOneWithoutResultsNestedInput = {
    create?: XOR<StudentCreateWithoutResultsInput, StudentUncheckedCreateWithoutResultsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutResultsInput
    upsert?: StudentUpsertWithoutResultsInput
    disconnect?: StudentWhereInput | boolean
    delete?: StudentWhereInput | boolean
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutResultsInput, StudentUpdateWithoutResultsInput>, StudentUncheckedUpdateWithoutResultsInput>
  }

  export type AssessmentsUpdateManyWithoutResultNestedInput = {
    create?: XOR<AssessmentsCreateWithoutResultInput, AssessmentsUncheckedCreateWithoutResultInput> | AssessmentsCreateWithoutResultInput[] | AssessmentsUncheckedCreateWithoutResultInput[]
    connectOrCreate?: AssessmentsCreateOrConnectWithoutResultInput | AssessmentsCreateOrConnectWithoutResultInput[]
    upsert?: AssessmentsUpsertWithWhereUniqueWithoutResultInput | AssessmentsUpsertWithWhereUniqueWithoutResultInput[]
    createMany?: AssessmentsCreateManyResultInputEnvelope
    set?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
    disconnect?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
    delete?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
    connect?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
    update?: AssessmentsUpdateWithWhereUniqueWithoutResultInput | AssessmentsUpdateWithWhereUniqueWithoutResultInput[]
    updateMany?: AssessmentsUpdateManyWithWhereWithoutResultInput | AssessmentsUpdateManyWithWhereWithoutResultInput[]
    deleteMany?: AssessmentsScalarWhereInput | AssessmentsScalarWhereInput[]
  }

  export type AssessmentsUncheckedUpdateManyWithoutResultNestedInput = {
    create?: XOR<AssessmentsCreateWithoutResultInput, AssessmentsUncheckedCreateWithoutResultInput> | AssessmentsCreateWithoutResultInput[] | AssessmentsUncheckedCreateWithoutResultInput[]
    connectOrCreate?: AssessmentsCreateOrConnectWithoutResultInput | AssessmentsCreateOrConnectWithoutResultInput[]
    upsert?: AssessmentsUpsertWithWhereUniqueWithoutResultInput | AssessmentsUpsertWithWhereUniqueWithoutResultInput[]
    createMany?: AssessmentsCreateManyResultInputEnvelope
    set?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
    disconnect?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
    delete?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
    connect?: AssessmentsWhereUniqueInput | AssessmentsWhereUniqueInput[]
    update?: AssessmentsUpdateWithWhereUniqueWithoutResultInput | AssessmentsUpdateWithWhereUniqueWithoutResultInput[]
    updateMany?: AssessmentsUpdateManyWithWhereWithoutResultInput | AssessmentsUpdateManyWithWhereWithoutResultInput[]
    deleteMany?: AssessmentsScalarWhereInput | AssessmentsScalarWhereInput[]
  }

  export type ResultCreateNestedOneWithoutAssessmentsInput = {
    create?: XOR<ResultCreateWithoutAssessmentsInput, ResultUncheckedCreateWithoutAssessmentsInput>
    connectOrCreate?: ResultCreateOrConnectWithoutAssessmentsInput
    connect?: ResultWhereUniqueInput
  }

  export type ResultUpdateOneWithoutAssessmentsNestedInput = {
    create?: XOR<ResultCreateWithoutAssessmentsInput, ResultUncheckedCreateWithoutAssessmentsInput>
    connectOrCreate?: ResultCreateOrConnectWithoutAssessmentsInput
    upsert?: ResultUpsertWithoutAssessmentsInput
    disconnect?: ResultWhereInput | boolean
    delete?: ResultWhereInput | boolean
    connect?: ResultWhereUniqueInput
    update?: XOR<XOR<ResultUpdateToOneWithWhereWithoutAssessmentsInput, ResultUpdateWithoutAssessmentsInput>, ResultUncheckedUpdateWithoutAssessmentsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type SchoolCreateWithoutUsersInput = {
    uuid?: string
    token?: string
    email: string
    slug: string
    name: string
    contact?: string | null
    avatar?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    branches?: BranchCreateNestedManyWithoutSchoolInput
    access?: BranchAccessCreateNestedManyWithoutSchoolInput
  }

  export type SchoolUncheckedCreateWithoutUsersInput = {
    id?: number
    uuid?: string
    token?: string
    email: string
    slug: string
    name: string
    contact?: string | null
    avatar?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    branches?: BranchUncheckedCreateNestedManyWithoutSchoolInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutSchoolInput
  }

  export type SchoolCreateOrConnectWithoutUsersInput = {
    where: SchoolWhereUniqueInput
    create: XOR<SchoolCreateWithoutUsersInput, SchoolUncheckedCreateWithoutUsersInput>
  }

  export type StudentCreateWithoutParentInput = {
    uuid?: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    branch: BranchCreateNestedOneWithoutStudentsInput
    class: ClassCreateNestedOneWithoutStudentsInput
    results?: ResultCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutParentInput = {
    id?: number
    uuid?: string
    branch_uuid: string
    class_uuid: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    results?: ResultUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutParentInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutParentInput, StudentUncheckedCreateWithoutParentInput>
  }

  export type StudentCreateManyParentInputEnvelope = {
    data: StudentCreateManyParentInput | StudentCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type BranchAccessCreateWithoutUserInput = {
    role: $Enums.Role
    school?: SchoolCreateNestedOneWithoutAccessInput
    branch?: BranchCreateNestedOneWithoutAccessInput
  }

  export type BranchAccessUncheckedCreateWithoutUserInput = {
    id?: number
    role: $Enums.Role
    school_uuid: string
    branch_uuid: string
  }

  export type BranchAccessCreateOrConnectWithoutUserInput = {
    where: BranchAccessWhereUniqueInput
    create: XOR<BranchAccessCreateWithoutUserInput, BranchAccessUncheckedCreateWithoutUserInput>
  }

  export type BranchAccessCreateManyUserInputEnvelope = {
    data: BranchAccessCreateManyUserInput | BranchAccessCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccessControlCreateWithoutUserInput = {
    access: string
    branch?: BranchCreateNestedOneWithoutControlInput
  }

  export type AccessControlUncheckedCreateWithoutUserInput = {
    id?: number
    branch_uuid: string
    access: string
  }

  export type AccessControlCreateOrConnectWithoutUserInput = {
    where: AccessControlWhereUniqueInput
    create: XOR<AccessControlCreateWithoutUserInput, AccessControlUncheckedCreateWithoutUserInput>
  }

  export type AccessControlCreateManyUserInputEnvelope = {
    data: AccessControlCreateManyUserInput | AccessControlCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SchoolUpsertWithoutUsersInput = {
    update: XOR<SchoolUpdateWithoutUsersInput, SchoolUncheckedUpdateWithoutUsersInput>
    create: XOR<SchoolCreateWithoutUsersInput, SchoolUncheckedCreateWithoutUsersInput>
    where?: SchoolWhereInput
  }

  export type SchoolUpdateToOneWithWhereWithoutUsersInput = {
    where?: SchoolWhereInput
    data: XOR<SchoolUpdateWithoutUsersInput, SchoolUncheckedUpdateWithoutUsersInput>
  }

  export type SchoolUpdateWithoutUsersInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    branches?: BranchUpdateManyWithoutSchoolNestedInput
    access?: BranchAccessUpdateManyWithoutSchoolNestedInput
  }

  export type SchoolUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    branches?: BranchUncheckedUpdateManyWithoutSchoolNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutSchoolNestedInput
  }

  export type StudentUpsertWithWhereUniqueWithoutParentInput = {
    where: StudentWhereUniqueInput
    update: XOR<StudentUpdateWithoutParentInput, StudentUncheckedUpdateWithoutParentInput>
    create: XOR<StudentCreateWithoutParentInput, StudentUncheckedCreateWithoutParentInput>
  }

  export type StudentUpdateWithWhereUniqueWithoutParentInput = {
    where: StudentWhereUniqueInput
    data: XOR<StudentUpdateWithoutParentInput, StudentUncheckedUpdateWithoutParentInput>
  }

  export type StudentUpdateManyWithWhereWithoutParentInput = {
    where: StudentScalarWhereInput
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyWithoutParentInput>
  }

  export type StudentScalarWhereInput = {
    AND?: StudentScalarWhereInput | StudentScalarWhereInput[]
    OR?: StudentScalarWhereInput[]
    NOT?: StudentScalarWhereInput | StudentScalarWhereInput[]
    id?: IntFilter<"Student"> | number
    uuid?: StringFilter<"Student"> | string
    parent_uuid?: StringFilter<"Student"> | string
    branch_uuid?: StringFilter<"Student"> | string
    class_uuid?: StringFilter<"Student"> | string
    reg_number?: StringFilter<"Student"> | string
    name?: StringFilter<"Student"> | string
    avatar?: StringNullableFilter<"Student"> | string | null
    created_at?: DateTimeFilter<"Student"> | Date | string
    updated_at?: DateTimeFilter<"Student"> | Date | string
  }

  export type BranchAccessUpsertWithWhereUniqueWithoutUserInput = {
    where: BranchAccessWhereUniqueInput
    update: XOR<BranchAccessUpdateWithoutUserInput, BranchAccessUncheckedUpdateWithoutUserInput>
    create: XOR<BranchAccessCreateWithoutUserInput, BranchAccessUncheckedCreateWithoutUserInput>
  }

  export type BranchAccessUpdateWithWhereUniqueWithoutUserInput = {
    where: BranchAccessWhereUniqueInput
    data: XOR<BranchAccessUpdateWithoutUserInput, BranchAccessUncheckedUpdateWithoutUserInput>
  }

  export type BranchAccessUpdateManyWithWhereWithoutUserInput = {
    where: BranchAccessScalarWhereInput
    data: XOR<BranchAccessUpdateManyMutationInput, BranchAccessUncheckedUpdateManyWithoutUserInput>
  }

  export type BranchAccessScalarWhereInput = {
    AND?: BranchAccessScalarWhereInput | BranchAccessScalarWhereInput[]
    OR?: BranchAccessScalarWhereInput[]
    NOT?: BranchAccessScalarWhereInput | BranchAccessScalarWhereInput[]
    id?: IntFilter<"BranchAccess"> | number
    role?: EnumRoleFilter<"BranchAccess"> | $Enums.Role
    user_uuid?: StringFilter<"BranchAccess"> | string
    school_uuid?: StringFilter<"BranchAccess"> | string
    branch_uuid?: StringFilter<"BranchAccess"> | string
  }

  export type AccessControlUpsertWithWhereUniqueWithoutUserInput = {
    where: AccessControlWhereUniqueInput
    update: XOR<AccessControlUpdateWithoutUserInput, AccessControlUncheckedUpdateWithoutUserInput>
    create: XOR<AccessControlCreateWithoutUserInput, AccessControlUncheckedCreateWithoutUserInput>
  }

  export type AccessControlUpdateWithWhereUniqueWithoutUserInput = {
    where: AccessControlWhereUniqueInput
    data: XOR<AccessControlUpdateWithoutUserInput, AccessControlUncheckedUpdateWithoutUserInput>
  }

  export type AccessControlUpdateManyWithWhereWithoutUserInput = {
    where: AccessControlScalarWhereInput
    data: XOR<AccessControlUpdateManyMutationInput, AccessControlUncheckedUpdateManyWithoutUserInput>
  }

  export type AccessControlScalarWhereInput = {
    AND?: AccessControlScalarWhereInput | AccessControlScalarWhereInput[]
    OR?: AccessControlScalarWhereInput[]
    NOT?: AccessControlScalarWhereInput | AccessControlScalarWhereInput[]
    id?: IntFilter<"AccessControl"> | number
    user_uuid?: StringFilter<"AccessControl"> | string
    branch_uuid?: StringFilter<"AccessControl"> | string
    access?: StringFilter<"AccessControl"> | string
  }

  export type UserCreateWithoutControlInput = {
    uuid?: string
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    school?: SchoolCreateNestedOneWithoutUsersInput
    students?: StudentCreateNestedManyWithoutParentInput
    access?: BranchAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutControlInput = {
    id?: number
    uuid?: string
    school_uuid?: string | null
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    students?: StudentUncheckedCreateNestedManyWithoutParentInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutControlInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutControlInput, UserUncheckedCreateWithoutControlInput>
  }

  export type BranchCreateWithoutControlInput = {
    uuid?: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeCreateNestedManyWithoutBranchInput
    classes?: ClassCreateNestedManyWithoutBranchInput
    students?: StudentCreateNestedManyWithoutBranchInput
    access?: BranchAccessCreateNestedManyWithoutBranchInput
    school: SchoolCreateNestedOneWithoutBranchesInput
  }

  export type BranchUncheckedCreateWithoutControlInput = {
    id?: number
    uuid?: string
    school_uuid: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeUncheckedCreateNestedManyWithoutBranchInput
    classes?: ClassUncheckedCreateNestedManyWithoutBranchInput
    students?: StudentUncheckedCreateNestedManyWithoutBranchInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutBranchInput
  }

  export type BranchCreateOrConnectWithoutControlInput = {
    where: BranchWhereUniqueInput
    create: XOR<BranchCreateWithoutControlInput, BranchUncheckedCreateWithoutControlInput>
  }

  export type UserUpsertWithoutControlInput = {
    update: XOR<UserUpdateWithoutControlInput, UserUncheckedUpdateWithoutControlInput>
    create: XOR<UserCreateWithoutControlInput, UserUncheckedCreateWithoutControlInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutControlInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutControlInput, UserUncheckedUpdateWithoutControlInput>
  }

  export type UserUpdateWithoutControlInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    school?: SchoolUpdateOneWithoutUsersNestedInput
    students?: StudentUpdateManyWithoutParentNestedInput
    access?: BranchAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutControlInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUncheckedUpdateManyWithoutParentNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BranchUpsertWithoutControlInput = {
    update: XOR<BranchUpdateWithoutControlInput, BranchUncheckedUpdateWithoutControlInput>
    create: XOR<BranchCreateWithoutControlInput, BranchUncheckedCreateWithoutControlInput>
    where?: BranchWhereInput
  }

  export type BranchUpdateToOneWithWhereWithoutControlInput = {
    where?: BranchWhereInput
    data: XOR<BranchUpdateWithoutControlInput, BranchUncheckedUpdateWithoutControlInput>
  }

  export type BranchUpdateWithoutControlInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUpdateManyWithoutBranchNestedInput
    classes?: ClassUpdateManyWithoutBranchNestedInput
    students?: StudentUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUpdateManyWithoutBranchNestedInput
    school?: SchoolUpdateOneRequiredWithoutBranchesNestedInput
  }

  export type BranchUncheckedUpdateWithoutControlInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUncheckedUpdateManyWithoutBranchNestedInput
    classes?: ClassUncheckedUpdateManyWithoutBranchNestedInput
    students?: StudentUncheckedUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutBranchNestedInput
  }

  export type UserCreateWithoutSchoolInput = {
    uuid?: string
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    students?: StudentCreateNestedManyWithoutParentInput
    access?: BranchAccessCreateNestedManyWithoutUserInput
    control?: AccessControlCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSchoolInput = {
    id?: number
    uuid?: string
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    students?: StudentUncheckedCreateNestedManyWithoutParentInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutUserInput
    control?: AccessControlUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSchoolInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSchoolInput, UserUncheckedCreateWithoutSchoolInput>
  }

  export type UserCreateManySchoolInputEnvelope = {
    data: UserCreateManySchoolInput | UserCreateManySchoolInput[]
    skipDuplicates?: boolean
  }

  export type BranchCreateWithoutSchoolInput = {
    uuid?: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeCreateNestedManyWithoutBranchInput
    classes?: ClassCreateNestedManyWithoutBranchInput
    students?: StudentCreateNestedManyWithoutBranchInput
    control?: AccessControlCreateNestedManyWithoutBranchInput
    access?: BranchAccessCreateNestedManyWithoutBranchInput
  }

  export type BranchUncheckedCreateWithoutSchoolInput = {
    id?: number
    uuid?: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeUncheckedCreateNestedManyWithoutBranchInput
    classes?: ClassUncheckedCreateNestedManyWithoutBranchInput
    students?: StudentUncheckedCreateNestedManyWithoutBranchInput
    control?: AccessControlUncheckedCreateNestedManyWithoutBranchInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutBranchInput
  }

  export type BranchCreateOrConnectWithoutSchoolInput = {
    where: BranchWhereUniqueInput
    create: XOR<BranchCreateWithoutSchoolInput, BranchUncheckedCreateWithoutSchoolInput>
  }

  export type BranchCreateManySchoolInputEnvelope = {
    data: BranchCreateManySchoolInput | BranchCreateManySchoolInput[]
    skipDuplicates?: boolean
  }

  export type BranchAccessCreateWithoutSchoolInput = {
    role: $Enums.Role
    user?: UserCreateNestedOneWithoutAccessInput
    branch?: BranchCreateNestedOneWithoutAccessInput
  }

  export type BranchAccessUncheckedCreateWithoutSchoolInput = {
    id?: number
    role: $Enums.Role
    user_uuid: string
    branch_uuid: string
  }

  export type BranchAccessCreateOrConnectWithoutSchoolInput = {
    where: BranchAccessWhereUniqueInput
    create: XOR<BranchAccessCreateWithoutSchoolInput, BranchAccessUncheckedCreateWithoutSchoolInput>
  }

  export type BranchAccessCreateManySchoolInputEnvelope = {
    data: BranchAccessCreateManySchoolInput | BranchAccessCreateManySchoolInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutSchoolInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutSchoolInput, UserUncheckedUpdateWithoutSchoolInput>
    create: XOR<UserCreateWithoutSchoolInput, UserUncheckedCreateWithoutSchoolInput>
  }

  export type UserUpdateWithWhereUniqueWithoutSchoolInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutSchoolInput, UserUncheckedUpdateWithoutSchoolInput>
  }

  export type UserUpdateManyWithWhereWithoutSchoolInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutSchoolInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: IntFilter<"User"> | number
    uuid?: StringFilter<"User"> | string
    school_uuid?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    contact?: StringNullableFilter<"User"> | string | null
    alt_contact?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    position?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
  }

  export type BranchUpsertWithWhereUniqueWithoutSchoolInput = {
    where: BranchWhereUniqueInput
    update: XOR<BranchUpdateWithoutSchoolInput, BranchUncheckedUpdateWithoutSchoolInput>
    create: XOR<BranchCreateWithoutSchoolInput, BranchUncheckedCreateWithoutSchoolInput>
  }

  export type BranchUpdateWithWhereUniqueWithoutSchoolInput = {
    where: BranchWhereUniqueInput
    data: XOR<BranchUpdateWithoutSchoolInput, BranchUncheckedUpdateWithoutSchoolInput>
  }

  export type BranchUpdateManyWithWhereWithoutSchoolInput = {
    where: BranchScalarWhereInput
    data: XOR<BranchUpdateManyMutationInput, BranchUncheckedUpdateManyWithoutSchoolInput>
  }

  export type BranchScalarWhereInput = {
    AND?: BranchScalarWhereInput | BranchScalarWhereInput[]
    OR?: BranchScalarWhereInput[]
    NOT?: BranchScalarWhereInput | BranchScalarWhereInput[]
    id?: IntFilter<"Branch"> | number
    uuid?: StringFilter<"Branch"> | string
    school_uuid?: StringFilter<"Branch"> | string
    name?: StringFilter<"Branch"> | string
    email?: StringNullableFilter<"Branch"> | string | null
    contact?: StringNullableFilter<"Branch"> | string | null
    avatar?: StringNullableFilter<"Branch"> | string | null
    address?: StringNullableFilter<"Branch"> | string | null
    created_at?: DateTimeFilter<"Branch"> | Date | string
    updated_at?: DateTimeFilter<"Branch"> | Date | string
  }

  export type BranchAccessUpsertWithWhereUniqueWithoutSchoolInput = {
    where: BranchAccessWhereUniqueInput
    update: XOR<BranchAccessUpdateWithoutSchoolInput, BranchAccessUncheckedUpdateWithoutSchoolInput>
    create: XOR<BranchAccessCreateWithoutSchoolInput, BranchAccessUncheckedCreateWithoutSchoolInput>
  }

  export type BranchAccessUpdateWithWhereUniqueWithoutSchoolInput = {
    where: BranchAccessWhereUniqueInput
    data: XOR<BranchAccessUpdateWithoutSchoolInput, BranchAccessUncheckedUpdateWithoutSchoolInput>
  }

  export type BranchAccessUpdateManyWithWhereWithoutSchoolInput = {
    where: BranchAccessScalarWhereInput
    data: XOR<BranchAccessUpdateManyMutationInput, BranchAccessUncheckedUpdateManyWithoutSchoolInput>
  }

  export type GradeCreateWithoutBranchInput = {
    uuid?: string
    score: number
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GradeUncheckedCreateWithoutBranchInput = {
    id?: number
    uuid?: string
    score: number
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GradeCreateOrConnectWithoutBranchInput = {
    where: GradeWhereUniqueInput
    create: XOR<GradeCreateWithoutBranchInput, GradeUncheckedCreateWithoutBranchInput>
  }

  export type GradeCreateManyBranchInputEnvelope = {
    data: GradeCreateManyBranchInput | GradeCreateManyBranchInput[]
    skipDuplicates?: boolean
  }

  export type ClassCreateWithoutBranchInput = {
    uuid?: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    subjects?: SubjectCreateNestedManyWithoutClassInput
    students?: StudentCreateNestedManyWithoutClassInput
  }

  export type ClassUncheckedCreateWithoutBranchInput = {
    id?: number
    uuid?: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    subjects?: SubjectUncheckedCreateNestedManyWithoutClassInput
    students?: StudentUncheckedCreateNestedManyWithoutClassInput
  }

  export type ClassCreateOrConnectWithoutBranchInput = {
    where: ClassWhereUniqueInput
    create: XOR<ClassCreateWithoutBranchInput, ClassUncheckedCreateWithoutBranchInput>
  }

  export type ClassCreateManyBranchInputEnvelope = {
    data: ClassCreateManyBranchInput | ClassCreateManyBranchInput[]
    skipDuplicates?: boolean
  }

  export type StudentCreateWithoutBranchInput = {
    uuid?: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    parent: UserCreateNestedOneWithoutStudentsInput
    class: ClassCreateNestedOneWithoutStudentsInput
    results?: ResultCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutBranchInput = {
    id?: number
    uuid?: string
    parent_uuid: string
    class_uuid: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    results?: ResultUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutBranchInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutBranchInput, StudentUncheckedCreateWithoutBranchInput>
  }

  export type StudentCreateManyBranchInputEnvelope = {
    data: StudentCreateManyBranchInput | StudentCreateManyBranchInput[]
    skipDuplicates?: boolean
  }

  export type AccessControlCreateWithoutBranchInput = {
    access: string
    user?: UserCreateNestedOneWithoutControlInput
  }

  export type AccessControlUncheckedCreateWithoutBranchInput = {
    id?: number
    user_uuid: string
    access: string
  }

  export type AccessControlCreateOrConnectWithoutBranchInput = {
    where: AccessControlWhereUniqueInput
    create: XOR<AccessControlCreateWithoutBranchInput, AccessControlUncheckedCreateWithoutBranchInput>
  }

  export type AccessControlCreateManyBranchInputEnvelope = {
    data: AccessControlCreateManyBranchInput | AccessControlCreateManyBranchInput[]
    skipDuplicates?: boolean
  }

  export type BranchAccessCreateWithoutBranchInput = {
    role: $Enums.Role
    user?: UserCreateNestedOneWithoutAccessInput
    school?: SchoolCreateNestedOneWithoutAccessInput
  }

  export type BranchAccessUncheckedCreateWithoutBranchInput = {
    id?: number
    role: $Enums.Role
    user_uuid: string
    school_uuid: string
  }

  export type BranchAccessCreateOrConnectWithoutBranchInput = {
    where: BranchAccessWhereUniqueInput
    create: XOR<BranchAccessCreateWithoutBranchInput, BranchAccessUncheckedCreateWithoutBranchInput>
  }

  export type BranchAccessCreateManyBranchInputEnvelope = {
    data: BranchAccessCreateManyBranchInput | BranchAccessCreateManyBranchInput[]
    skipDuplicates?: boolean
  }

  export type SchoolCreateWithoutBranchesInput = {
    uuid?: string
    token?: string
    email: string
    slug: string
    name: string
    contact?: string | null
    avatar?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutSchoolInput
    access?: BranchAccessCreateNestedManyWithoutSchoolInput
  }

  export type SchoolUncheckedCreateWithoutBranchesInput = {
    id?: number
    uuid?: string
    token?: string
    email: string
    slug: string
    name: string
    contact?: string | null
    avatar?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutSchoolInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutSchoolInput
  }

  export type SchoolCreateOrConnectWithoutBranchesInput = {
    where: SchoolWhereUniqueInput
    create: XOR<SchoolCreateWithoutBranchesInput, SchoolUncheckedCreateWithoutBranchesInput>
  }

  export type GradeUpsertWithWhereUniqueWithoutBranchInput = {
    where: GradeWhereUniqueInput
    update: XOR<GradeUpdateWithoutBranchInput, GradeUncheckedUpdateWithoutBranchInput>
    create: XOR<GradeCreateWithoutBranchInput, GradeUncheckedCreateWithoutBranchInput>
  }

  export type GradeUpdateWithWhereUniqueWithoutBranchInput = {
    where: GradeWhereUniqueInput
    data: XOR<GradeUpdateWithoutBranchInput, GradeUncheckedUpdateWithoutBranchInput>
  }

  export type GradeUpdateManyWithWhereWithoutBranchInput = {
    where: GradeScalarWhereInput
    data: XOR<GradeUpdateManyMutationInput, GradeUncheckedUpdateManyWithoutBranchInput>
  }

  export type GradeScalarWhereInput = {
    AND?: GradeScalarWhereInput | GradeScalarWhereInput[]
    OR?: GradeScalarWhereInput[]
    NOT?: GradeScalarWhereInput | GradeScalarWhereInput[]
    id?: IntFilter<"Grade"> | number
    uuid?: StringFilter<"Grade"> | string
    branch_uuid?: StringFilter<"Grade"> | string
    score?: FloatFilter<"Grade"> | number
    grade?: StringFilter<"Grade"> | string
    remark?: StringFilter<"Grade"> | string
    created_at?: DateTimeFilter<"Grade"> | Date | string
    updated_at?: DateTimeFilter<"Grade"> | Date | string
  }

  export type ClassUpsertWithWhereUniqueWithoutBranchInput = {
    where: ClassWhereUniqueInput
    update: XOR<ClassUpdateWithoutBranchInput, ClassUncheckedUpdateWithoutBranchInput>
    create: XOR<ClassCreateWithoutBranchInput, ClassUncheckedCreateWithoutBranchInput>
  }

  export type ClassUpdateWithWhereUniqueWithoutBranchInput = {
    where: ClassWhereUniqueInput
    data: XOR<ClassUpdateWithoutBranchInput, ClassUncheckedUpdateWithoutBranchInput>
  }

  export type ClassUpdateManyWithWhereWithoutBranchInput = {
    where: ClassScalarWhereInput
    data: XOR<ClassUpdateManyMutationInput, ClassUncheckedUpdateManyWithoutBranchInput>
  }

  export type ClassScalarWhereInput = {
    AND?: ClassScalarWhereInput | ClassScalarWhereInput[]
    OR?: ClassScalarWhereInput[]
    NOT?: ClassScalarWhereInput | ClassScalarWhereInput[]
    id?: IntFilter<"Class"> | number
    uuid?: StringFilter<"Class"> | string
    branch_uuid?: StringFilter<"Class"> | string
    name?: StringFilter<"Class"> | string
    status?: StringFilter<"Class"> | string
    created_at?: DateTimeFilter<"Class"> | Date | string
    updated_at?: DateTimeFilter<"Class"> | Date | string
  }

  export type StudentUpsertWithWhereUniqueWithoutBranchInput = {
    where: StudentWhereUniqueInput
    update: XOR<StudentUpdateWithoutBranchInput, StudentUncheckedUpdateWithoutBranchInput>
    create: XOR<StudentCreateWithoutBranchInput, StudentUncheckedCreateWithoutBranchInput>
  }

  export type StudentUpdateWithWhereUniqueWithoutBranchInput = {
    where: StudentWhereUniqueInput
    data: XOR<StudentUpdateWithoutBranchInput, StudentUncheckedUpdateWithoutBranchInput>
  }

  export type StudentUpdateManyWithWhereWithoutBranchInput = {
    where: StudentScalarWhereInput
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyWithoutBranchInput>
  }

  export type AccessControlUpsertWithWhereUniqueWithoutBranchInput = {
    where: AccessControlWhereUniqueInput
    update: XOR<AccessControlUpdateWithoutBranchInput, AccessControlUncheckedUpdateWithoutBranchInput>
    create: XOR<AccessControlCreateWithoutBranchInput, AccessControlUncheckedCreateWithoutBranchInput>
  }

  export type AccessControlUpdateWithWhereUniqueWithoutBranchInput = {
    where: AccessControlWhereUniqueInput
    data: XOR<AccessControlUpdateWithoutBranchInput, AccessControlUncheckedUpdateWithoutBranchInput>
  }

  export type AccessControlUpdateManyWithWhereWithoutBranchInput = {
    where: AccessControlScalarWhereInput
    data: XOR<AccessControlUpdateManyMutationInput, AccessControlUncheckedUpdateManyWithoutBranchInput>
  }

  export type BranchAccessUpsertWithWhereUniqueWithoutBranchInput = {
    where: BranchAccessWhereUniqueInput
    update: XOR<BranchAccessUpdateWithoutBranchInput, BranchAccessUncheckedUpdateWithoutBranchInput>
    create: XOR<BranchAccessCreateWithoutBranchInput, BranchAccessUncheckedCreateWithoutBranchInput>
  }

  export type BranchAccessUpdateWithWhereUniqueWithoutBranchInput = {
    where: BranchAccessWhereUniqueInput
    data: XOR<BranchAccessUpdateWithoutBranchInput, BranchAccessUncheckedUpdateWithoutBranchInput>
  }

  export type BranchAccessUpdateManyWithWhereWithoutBranchInput = {
    where: BranchAccessScalarWhereInput
    data: XOR<BranchAccessUpdateManyMutationInput, BranchAccessUncheckedUpdateManyWithoutBranchInput>
  }

  export type SchoolUpsertWithoutBranchesInput = {
    update: XOR<SchoolUpdateWithoutBranchesInput, SchoolUncheckedUpdateWithoutBranchesInput>
    create: XOR<SchoolCreateWithoutBranchesInput, SchoolUncheckedCreateWithoutBranchesInput>
    where?: SchoolWhereInput
  }

  export type SchoolUpdateToOneWithWhereWithoutBranchesInput = {
    where?: SchoolWhereInput
    data: XOR<SchoolUpdateWithoutBranchesInput, SchoolUncheckedUpdateWithoutBranchesInput>
  }

  export type SchoolUpdateWithoutBranchesInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutSchoolNestedInput
    access?: BranchAccessUpdateManyWithoutSchoolNestedInput
  }

  export type SchoolUncheckedUpdateWithoutBranchesInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutSchoolNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutSchoolNestedInput
  }

  export type UserCreateWithoutAccessInput = {
    uuid?: string
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    school?: SchoolCreateNestedOneWithoutUsersInput
    students?: StudentCreateNestedManyWithoutParentInput
    control?: AccessControlCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccessInput = {
    id?: number
    uuid?: string
    school_uuid?: string | null
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    students?: StudentUncheckedCreateNestedManyWithoutParentInput
    control?: AccessControlUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccessInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccessInput, UserUncheckedCreateWithoutAccessInput>
  }

  export type SchoolCreateWithoutAccessInput = {
    uuid?: string
    token?: string
    email: string
    slug: string
    name: string
    contact?: string | null
    avatar?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutSchoolInput
    branches?: BranchCreateNestedManyWithoutSchoolInput
  }

  export type SchoolUncheckedCreateWithoutAccessInput = {
    id?: number
    uuid?: string
    token?: string
    email: string
    slug: string
    name: string
    contact?: string | null
    avatar?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutSchoolInput
    branches?: BranchUncheckedCreateNestedManyWithoutSchoolInput
  }

  export type SchoolCreateOrConnectWithoutAccessInput = {
    where: SchoolWhereUniqueInput
    create: XOR<SchoolCreateWithoutAccessInput, SchoolUncheckedCreateWithoutAccessInput>
  }

  export type BranchCreateWithoutAccessInput = {
    uuid?: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeCreateNestedManyWithoutBranchInput
    classes?: ClassCreateNestedManyWithoutBranchInput
    students?: StudentCreateNestedManyWithoutBranchInput
    control?: AccessControlCreateNestedManyWithoutBranchInput
    school: SchoolCreateNestedOneWithoutBranchesInput
  }

  export type BranchUncheckedCreateWithoutAccessInput = {
    id?: number
    uuid?: string
    school_uuid: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeUncheckedCreateNestedManyWithoutBranchInput
    classes?: ClassUncheckedCreateNestedManyWithoutBranchInput
    students?: StudentUncheckedCreateNestedManyWithoutBranchInput
    control?: AccessControlUncheckedCreateNestedManyWithoutBranchInput
  }

  export type BranchCreateOrConnectWithoutAccessInput = {
    where: BranchWhereUniqueInput
    create: XOR<BranchCreateWithoutAccessInput, BranchUncheckedCreateWithoutAccessInput>
  }

  export type UserUpsertWithoutAccessInput = {
    update: XOR<UserUpdateWithoutAccessInput, UserUncheckedUpdateWithoutAccessInput>
    create: XOR<UserCreateWithoutAccessInput, UserUncheckedCreateWithoutAccessInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccessInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccessInput, UserUncheckedUpdateWithoutAccessInput>
  }

  export type UserUpdateWithoutAccessInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    school?: SchoolUpdateOneWithoutUsersNestedInput
    students?: StudentUpdateManyWithoutParentNestedInput
    control?: AccessControlUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccessInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUncheckedUpdateManyWithoutParentNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SchoolUpsertWithoutAccessInput = {
    update: XOR<SchoolUpdateWithoutAccessInput, SchoolUncheckedUpdateWithoutAccessInput>
    create: XOR<SchoolCreateWithoutAccessInput, SchoolUncheckedCreateWithoutAccessInput>
    where?: SchoolWhereInput
  }

  export type SchoolUpdateToOneWithWhereWithoutAccessInput = {
    where?: SchoolWhereInput
    data: XOR<SchoolUpdateWithoutAccessInput, SchoolUncheckedUpdateWithoutAccessInput>
  }

  export type SchoolUpdateWithoutAccessInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutSchoolNestedInput
    branches?: BranchUpdateManyWithoutSchoolNestedInput
  }

  export type SchoolUncheckedUpdateWithoutAccessInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutSchoolNestedInput
    branches?: BranchUncheckedUpdateManyWithoutSchoolNestedInput
  }

  export type BranchUpsertWithoutAccessInput = {
    update: XOR<BranchUpdateWithoutAccessInput, BranchUncheckedUpdateWithoutAccessInput>
    create: XOR<BranchCreateWithoutAccessInput, BranchUncheckedCreateWithoutAccessInput>
    where?: BranchWhereInput
  }

  export type BranchUpdateToOneWithWhereWithoutAccessInput = {
    where?: BranchWhereInput
    data: XOR<BranchUpdateWithoutAccessInput, BranchUncheckedUpdateWithoutAccessInput>
  }

  export type BranchUpdateWithoutAccessInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUpdateManyWithoutBranchNestedInput
    classes?: ClassUpdateManyWithoutBranchNestedInput
    students?: StudentUpdateManyWithoutBranchNestedInput
    control?: AccessControlUpdateManyWithoutBranchNestedInput
    school?: SchoolUpdateOneRequiredWithoutBranchesNestedInput
  }

  export type BranchUncheckedUpdateWithoutAccessInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUncheckedUpdateManyWithoutBranchNestedInput
    classes?: ClassUncheckedUpdateManyWithoutBranchNestedInput
    students?: StudentUncheckedUpdateManyWithoutBranchNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutBranchNestedInput
  }

  export type UserCreateWithoutStudentsInput = {
    uuid?: string
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    school?: SchoolCreateNestedOneWithoutUsersInput
    access?: BranchAccessCreateNestedManyWithoutUserInput
    control?: AccessControlCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutStudentsInput = {
    id?: number
    uuid?: string
    school_uuid?: string | null
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    access?: BranchAccessUncheckedCreateNestedManyWithoutUserInput
    control?: AccessControlUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutStudentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStudentsInput, UserUncheckedCreateWithoutStudentsInput>
  }

  export type BranchCreateWithoutStudentsInput = {
    uuid?: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeCreateNestedManyWithoutBranchInput
    classes?: ClassCreateNestedManyWithoutBranchInput
    control?: AccessControlCreateNestedManyWithoutBranchInput
    access?: BranchAccessCreateNestedManyWithoutBranchInput
    school: SchoolCreateNestedOneWithoutBranchesInput
  }

  export type BranchUncheckedCreateWithoutStudentsInput = {
    id?: number
    uuid?: string
    school_uuid: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeUncheckedCreateNestedManyWithoutBranchInput
    classes?: ClassUncheckedCreateNestedManyWithoutBranchInput
    control?: AccessControlUncheckedCreateNestedManyWithoutBranchInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutBranchInput
  }

  export type BranchCreateOrConnectWithoutStudentsInput = {
    where: BranchWhereUniqueInput
    create: XOR<BranchCreateWithoutStudentsInput, BranchUncheckedCreateWithoutStudentsInput>
  }

  export type ClassCreateWithoutStudentsInput = {
    uuid?: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    branch?: BranchCreateNestedOneWithoutClassesInput
    subjects?: SubjectCreateNestedManyWithoutClassInput
  }

  export type ClassUncheckedCreateWithoutStudentsInput = {
    id?: number
    uuid?: string
    branch_uuid: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    subjects?: SubjectUncheckedCreateNestedManyWithoutClassInput
  }

  export type ClassCreateOrConnectWithoutStudentsInput = {
    where: ClassWhereUniqueInput
    create: XOR<ClassCreateWithoutStudentsInput, ClassUncheckedCreateWithoutStudentsInput>
  }

  export type ResultCreateWithoutStudentInput = {
    uuid?: string
    class_name: string
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
    assessments?: AssessmentsCreateNestedManyWithoutResultInput
  }

  export type ResultUncheckedCreateWithoutStudentInput = {
    id?: number
    uuid?: string
    class_name: string
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
    assessments?: AssessmentsUncheckedCreateNestedManyWithoutResultInput
  }

  export type ResultCreateOrConnectWithoutStudentInput = {
    where: ResultWhereUniqueInput
    create: XOR<ResultCreateWithoutStudentInput, ResultUncheckedCreateWithoutStudentInput>
  }

  export type ResultCreateManyStudentInputEnvelope = {
    data: ResultCreateManyStudentInput | ResultCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutStudentsInput = {
    update: XOR<UserUpdateWithoutStudentsInput, UserUncheckedUpdateWithoutStudentsInput>
    create: XOR<UserCreateWithoutStudentsInput, UserUncheckedCreateWithoutStudentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStudentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStudentsInput, UserUncheckedUpdateWithoutStudentsInput>
  }

  export type UserUpdateWithoutStudentsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    school?: SchoolUpdateOneWithoutUsersNestedInput
    access?: BranchAccessUpdateManyWithoutUserNestedInput
    control?: AccessControlUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutStudentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    access?: BranchAccessUncheckedUpdateManyWithoutUserNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BranchUpsertWithoutStudentsInput = {
    update: XOR<BranchUpdateWithoutStudentsInput, BranchUncheckedUpdateWithoutStudentsInput>
    create: XOR<BranchCreateWithoutStudentsInput, BranchUncheckedCreateWithoutStudentsInput>
    where?: BranchWhereInput
  }

  export type BranchUpdateToOneWithWhereWithoutStudentsInput = {
    where?: BranchWhereInput
    data: XOR<BranchUpdateWithoutStudentsInput, BranchUncheckedUpdateWithoutStudentsInput>
  }

  export type BranchUpdateWithoutStudentsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUpdateManyWithoutBranchNestedInput
    classes?: ClassUpdateManyWithoutBranchNestedInput
    control?: AccessControlUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUpdateManyWithoutBranchNestedInput
    school?: SchoolUpdateOneRequiredWithoutBranchesNestedInput
  }

  export type BranchUncheckedUpdateWithoutStudentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUncheckedUpdateManyWithoutBranchNestedInput
    classes?: ClassUncheckedUpdateManyWithoutBranchNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutBranchNestedInput
  }

  export type ClassUpsertWithoutStudentsInput = {
    update: XOR<ClassUpdateWithoutStudentsInput, ClassUncheckedUpdateWithoutStudentsInput>
    create: XOR<ClassCreateWithoutStudentsInput, ClassUncheckedCreateWithoutStudentsInput>
    where?: ClassWhereInput
  }

  export type ClassUpdateToOneWithWhereWithoutStudentsInput = {
    where?: ClassWhereInput
    data: XOR<ClassUpdateWithoutStudentsInput, ClassUncheckedUpdateWithoutStudentsInput>
  }

  export type ClassUpdateWithoutStudentsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    branch?: BranchUpdateOneWithoutClassesNestedInput
    subjects?: SubjectUpdateManyWithoutClassNestedInput
  }

  export type ClassUncheckedUpdateWithoutStudentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjects?: SubjectUncheckedUpdateManyWithoutClassNestedInput
  }

  export type ResultUpsertWithWhereUniqueWithoutStudentInput = {
    where: ResultWhereUniqueInput
    update: XOR<ResultUpdateWithoutStudentInput, ResultUncheckedUpdateWithoutStudentInput>
    create: XOR<ResultCreateWithoutStudentInput, ResultUncheckedCreateWithoutStudentInput>
  }

  export type ResultUpdateWithWhereUniqueWithoutStudentInput = {
    where: ResultWhereUniqueInput
    data: XOR<ResultUpdateWithoutStudentInput, ResultUncheckedUpdateWithoutStudentInput>
  }

  export type ResultUpdateManyWithWhereWithoutStudentInput = {
    where: ResultScalarWhereInput
    data: XOR<ResultUpdateManyMutationInput, ResultUncheckedUpdateManyWithoutStudentInput>
  }

  export type ResultScalarWhereInput = {
    AND?: ResultScalarWhereInput | ResultScalarWhereInput[]
    OR?: ResultScalarWhereInput[]
    NOT?: ResultScalarWhereInput | ResultScalarWhereInput[]
    id?: IntFilter<"Result"> | number
    uuid?: StringFilter<"Result"> | string
    student_uuid?: StringFilter<"Result"> | string
    class_name?: StringFilter<"Result"> | string
    grade?: StringFilter<"Result"> | string
    remark?: StringFilter<"Result"> | string
    created_at?: DateTimeFilter<"Result"> | Date | string
    updated_at?: DateTimeFilter<"Result"> | Date | string
  }

  export type BranchCreateWithoutClassesInput = {
    uuid?: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeCreateNestedManyWithoutBranchInput
    students?: StudentCreateNestedManyWithoutBranchInput
    control?: AccessControlCreateNestedManyWithoutBranchInput
    access?: BranchAccessCreateNestedManyWithoutBranchInput
    school: SchoolCreateNestedOneWithoutBranchesInput
  }

  export type BranchUncheckedCreateWithoutClassesInput = {
    id?: number
    uuid?: string
    school_uuid: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grades?: GradeUncheckedCreateNestedManyWithoutBranchInput
    students?: StudentUncheckedCreateNestedManyWithoutBranchInput
    control?: AccessControlUncheckedCreateNestedManyWithoutBranchInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutBranchInput
  }

  export type BranchCreateOrConnectWithoutClassesInput = {
    where: BranchWhereUniqueInput
    create: XOR<BranchCreateWithoutClassesInput, BranchUncheckedCreateWithoutClassesInput>
  }

  export type SubjectCreateWithoutClassInput = {
    uuid?: string
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubjectUncheckedCreateWithoutClassInput = {
    id?: number
    uuid?: string
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubjectCreateOrConnectWithoutClassInput = {
    where: SubjectWhereUniqueInput
    create: XOR<SubjectCreateWithoutClassInput, SubjectUncheckedCreateWithoutClassInput>
  }

  export type SubjectCreateManyClassInputEnvelope = {
    data: SubjectCreateManyClassInput | SubjectCreateManyClassInput[]
    skipDuplicates?: boolean
  }

  export type StudentCreateWithoutClassInput = {
    uuid?: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    parent: UserCreateNestedOneWithoutStudentsInput
    branch: BranchCreateNestedOneWithoutStudentsInput
    results?: ResultCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutClassInput = {
    id?: number
    uuid?: string
    parent_uuid: string
    branch_uuid: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    results?: ResultUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutClassInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutClassInput, StudentUncheckedCreateWithoutClassInput>
  }

  export type StudentCreateManyClassInputEnvelope = {
    data: StudentCreateManyClassInput | StudentCreateManyClassInput[]
    skipDuplicates?: boolean
  }

  export type BranchUpsertWithoutClassesInput = {
    update: XOR<BranchUpdateWithoutClassesInput, BranchUncheckedUpdateWithoutClassesInput>
    create: XOR<BranchCreateWithoutClassesInput, BranchUncheckedCreateWithoutClassesInput>
    where?: BranchWhereInput
  }

  export type BranchUpdateToOneWithWhereWithoutClassesInput = {
    where?: BranchWhereInput
    data: XOR<BranchUpdateWithoutClassesInput, BranchUncheckedUpdateWithoutClassesInput>
  }

  export type BranchUpdateWithoutClassesInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUpdateManyWithoutBranchNestedInput
    students?: StudentUpdateManyWithoutBranchNestedInput
    control?: AccessControlUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUpdateManyWithoutBranchNestedInput
    school?: SchoolUpdateOneRequiredWithoutBranchesNestedInput
  }

  export type BranchUncheckedUpdateWithoutClassesInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUncheckedUpdateManyWithoutBranchNestedInput
    students?: StudentUncheckedUpdateManyWithoutBranchNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutBranchNestedInput
  }

  export type SubjectUpsertWithWhereUniqueWithoutClassInput = {
    where: SubjectWhereUniqueInput
    update: XOR<SubjectUpdateWithoutClassInput, SubjectUncheckedUpdateWithoutClassInput>
    create: XOR<SubjectCreateWithoutClassInput, SubjectUncheckedCreateWithoutClassInput>
  }

  export type SubjectUpdateWithWhereUniqueWithoutClassInput = {
    where: SubjectWhereUniqueInput
    data: XOR<SubjectUpdateWithoutClassInput, SubjectUncheckedUpdateWithoutClassInput>
  }

  export type SubjectUpdateManyWithWhereWithoutClassInput = {
    where: SubjectScalarWhereInput
    data: XOR<SubjectUpdateManyMutationInput, SubjectUncheckedUpdateManyWithoutClassInput>
  }

  export type SubjectScalarWhereInput = {
    AND?: SubjectScalarWhereInput | SubjectScalarWhereInput[]
    OR?: SubjectScalarWhereInput[]
    NOT?: SubjectScalarWhereInput | SubjectScalarWhereInput[]
    id?: IntFilter<"Subject"> | number
    uuid?: StringFilter<"Subject"> | string
    class_uuid?: StringFilter<"Subject"> | string
    name?: StringFilter<"Subject"> | string
    created_at?: DateTimeFilter<"Subject"> | Date | string
    updated_at?: DateTimeFilter<"Subject"> | Date | string
  }

  export type StudentUpsertWithWhereUniqueWithoutClassInput = {
    where: StudentWhereUniqueInput
    update: XOR<StudentUpdateWithoutClassInput, StudentUncheckedUpdateWithoutClassInput>
    create: XOR<StudentCreateWithoutClassInput, StudentUncheckedCreateWithoutClassInput>
  }

  export type StudentUpdateWithWhereUniqueWithoutClassInput = {
    where: StudentWhereUniqueInput
    data: XOR<StudentUpdateWithoutClassInput, StudentUncheckedUpdateWithoutClassInput>
  }

  export type StudentUpdateManyWithWhereWithoutClassInput = {
    where: StudentScalarWhereInput
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyWithoutClassInput>
  }

  export type ClassCreateWithoutSubjectsInput = {
    uuid?: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    branch?: BranchCreateNestedOneWithoutClassesInput
    students?: StudentCreateNestedManyWithoutClassInput
  }

  export type ClassUncheckedCreateWithoutSubjectsInput = {
    id?: number
    uuid?: string
    branch_uuid: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    students?: StudentUncheckedCreateNestedManyWithoutClassInput
  }

  export type ClassCreateOrConnectWithoutSubjectsInput = {
    where: ClassWhereUniqueInput
    create: XOR<ClassCreateWithoutSubjectsInput, ClassUncheckedCreateWithoutSubjectsInput>
  }

  export type ClassUpsertWithoutSubjectsInput = {
    update: XOR<ClassUpdateWithoutSubjectsInput, ClassUncheckedUpdateWithoutSubjectsInput>
    create: XOR<ClassCreateWithoutSubjectsInput, ClassUncheckedCreateWithoutSubjectsInput>
    where?: ClassWhereInput
  }

  export type ClassUpdateToOneWithWhereWithoutSubjectsInput = {
    where?: ClassWhereInput
    data: XOR<ClassUpdateWithoutSubjectsInput, ClassUncheckedUpdateWithoutSubjectsInput>
  }

  export type ClassUpdateWithoutSubjectsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    branch?: BranchUpdateOneWithoutClassesNestedInput
    students?: StudentUpdateManyWithoutClassNestedInput
  }

  export type ClassUncheckedUpdateWithoutSubjectsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUncheckedUpdateManyWithoutClassNestedInput
  }

  export type BranchCreateWithoutGradesInput = {
    uuid?: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    classes?: ClassCreateNestedManyWithoutBranchInput
    students?: StudentCreateNestedManyWithoutBranchInput
    control?: AccessControlCreateNestedManyWithoutBranchInput
    access?: BranchAccessCreateNestedManyWithoutBranchInput
    school: SchoolCreateNestedOneWithoutBranchesInput
  }

  export type BranchUncheckedCreateWithoutGradesInput = {
    id?: number
    uuid?: string
    school_uuid: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    classes?: ClassUncheckedCreateNestedManyWithoutBranchInput
    students?: StudentUncheckedCreateNestedManyWithoutBranchInput
    control?: AccessControlUncheckedCreateNestedManyWithoutBranchInput
    access?: BranchAccessUncheckedCreateNestedManyWithoutBranchInput
  }

  export type BranchCreateOrConnectWithoutGradesInput = {
    where: BranchWhereUniqueInput
    create: XOR<BranchCreateWithoutGradesInput, BranchUncheckedCreateWithoutGradesInput>
  }

  export type BranchUpsertWithoutGradesInput = {
    update: XOR<BranchUpdateWithoutGradesInput, BranchUncheckedUpdateWithoutGradesInput>
    create: XOR<BranchCreateWithoutGradesInput, BranchUncheckedCreateWithoutGradesInput>
    where?: BranchWhereInput
  }

  export type BranchUpdateToOneWithWhereWithoutGradesInput = {
    where?: BranchWhereInput
    data: XOR<BranchUpdateWithoutGradesInput, BranchUncheckedUpdateWithoutGradesInput>
  }

  export type BranchUpdateWithoutGradesInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: ClassUpdateManyWithoutBranchNestedInput
    students?: StudentUpdateManyWithoutBranchNestedInput
    control?: AccessControlUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUpdateManyWithoutBranchNestedInput
    school?: SchoolUpdateOneRequiredWithoutBranchesNestedInput
  }

  export type BranchUncheckedUpdateWithoutGradesInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: ClassUncheckedUpdateManyWithoutBranchNestedInput
    students?: StudentUncheckedUpdateManyWithoutBranchNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutBranchNestedInput
  }

  export type StudentCreateWithoutResultsInput = {
    uuid?: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    parent: UserCreateNestedOneWithoutStudentsInput
    branch: BranchCreateNestedOneWithoutStudentsInput
    class: ClassCreateNestedOneWithoutStudentsInput
  }

  export type StudentUncheckedCreateWithoutResultsInput = {
    id?: number
    uuid?: string
    parent_uuid: string
    branch_uuid: string
    class_uuid: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type StudentCreateOrConnectWithoutResultsInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutResultsInput, StudentUncheckedCreateWithoutResultsInput>
  }

  export type AssessmentsCreateWithoutResultInput = {
    uuid?: string
    subject: string
    assignment: number
    assesment: number
    examination: number
    overall: number
    grade: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AssessmentsUncheckedCreateWithoutResultInput = {
    id?: number
    uuid?: string
    subject: string
    assignment: number
    assesment: number
    examination: number
    overall: number
    grade: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AssessmentsCreateOrConnectWithoutResultInput = {
    where: AssessmentsWhereUniqueInput
    create: XOR<AssessmentsCreateWithoutResultInput, AssessmentsUncheckedCreateWithoutResultInput>
  }

  export type AssessmentsCreateManyResultInputEnvelope = {
    data: AssessmentsCreateManyResultInput | AssessmentsCreateManyResultInput[]
    skipDuplicates?: boolean
  }

  export type StudentUpsertWithoutResultsInput = {
    update: XOR<StudentUpdateWithoutResultsInput, StudentUncheckedUpdateWithoutResultsInput>
    create: XOR<StudentCreateWithoutResultsInput, StudentUncheckedCreateWithoutResultsInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutResultsInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutResultsInput, StudentUncheckedUpdateWithoutResultsInput>
  }

  export type StudentUpdateWithoutResultsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: UserUpdateOneRequiredWithoutStudentsNestedInput
    branch?: BranchUpdateOneRequiredWithoutStudentsNestedInput
    class?: ClassUpdateOneRequiredWithoutStudentsNestedInput
  }

  export type StudentUncheckedUpdateWithoutResultsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    parent_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    class_uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentsUpsertWithWhereUniqueWithoutResultInput = {
    where: AssessmentsWhereUniqueInput
    update: XOR<AssessmentsUpdateWithoutResultInput, AssessmentsUncheckedUpdateWithoutResultInput>
    create: XOR<AssessmentsCreateWithoutResultInput, AssessmentsUncheckedCreateWithoutResultInput>
  }

  export type AssessmentsUpdateWithWhereUniqueWithoutResultInput = {
    where: AssessmentsWhereUniqueInput
    data: XOR<AssessmentsUpdateWithoutResultInput, AssessmentsUncheckedUpdateWithoutResultInput>
  }

  export type AssessmentsUpdateManyWithWhereWithoutResultInput = {
    where: AssessmentsScalarWhereInput
    data: XOR<AssessmentsUpdateManyMutationInput, AssessmentsUncheckedUpdateManyWithoutResultInput>
  }

  export type AssessmentsScalarWhereInput = {
    AND?: AssessmentsScalarWhereInput | AssessmentsScalarWhereInput[]
    OR?: AssessmentsScalarWhereInput[]
    NOT?: AssessmentsScalarWhereInput | AssessmentsScalarWhereInput[]
    id?: IntFilter<"Assessments"> | number
    uuid?: StringFilter<"Assessments"> | string
    result_uuid?: StringFilter<"Assessments"> | string
    subject?: StringFilter<"Assessments"> | string
    assignment?: FloatFilter<"Assessments"> | number
    assesment?: FloatFilter<"Assessments"> | number
    examination?: FloatFilter<"Assessments"> | number
    overall?: FloatFilter<"Assessments"> | number
    grade?: StringFilter<"Assessments"> | string
    created_at?: DateTimeFilter<"Assessments"> | Date | string
    updated_at?: DateTimeFilter<"Assessments"> | Date | string
  }

  export type ResultCreateWithoutAssessmentsInput = {
    uuid?: string
    class_name: string
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
    student?: StudentCreateNestedOneWithoutResultsInput
  }

  export type ResultUncheckedCreateWithoutAssessmentsInput = {
    id?: number
    uuid?: string
    student_uuid: string
    class_name: string
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ResultCreateOrConnectWithoutAssessmentsInput = {
    where: ResultWhereUniqueInput
    create: XOR<ResultCreateWithoutAssessmentsInput, ResultUncheckedCreateWithoutAssessmentsInput>
  }

  export type ResultUpsertWithoutAssessmentsInput = {
    update: XOR<ResultUpdateWithoutAssessmentsInput, ResultUncheckedUpdateWithoutAssessmentsInput>
    create: XOR<ResultCreateWithoutAssessmentsInput, ResultUncheckedCreateWithoutAssessmentsInput>
    where?: ResultWhereInput
  }

  export type ResultUpdateToOneWithWhereWithoutAssessmentsInput = {
    where?: ResultWhereInput
    data: XOR<ResultUpdateWithoutAssessmentsInput, ResultUncheckedUpdateWithoutAssessmentsInput>
  }

  export type ResultUpdateWithoutAssessmentsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    class_name?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutResultsNestedInput
  }

  export type ResultUncheckedUpdateWithoutAssessmentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    student_uuid?: StringFieldUpdateOperationsInput | string
    class_name?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCreateManyParentInput = {
    id?: number
    uuid?: string
    branch_uuid: string
    class_uuid: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BranchAccessCreateManyUserInput = {
    id?: number
    role: $Enums.Role
    school_uuid: string
    branch_uuid: string
  }

  export type AccessControlCreateManyUserInput = {
    id?: number
    branch_uuid: string
    access: string
  }

  export type StudentUpdateWithoutParentInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    branch?: BranchUpdateOneRequiredWithoutStudentsNestedInput
    class?: ClassUpdateOneRequiredWithoutStudentsNestedInput
    results?: ResultUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutParentInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    class_uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    results?: ResultUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateManyWithoutParentInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    class_uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BranchAccessUpdateWithoutUserInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    school?: SchoolUpdateOneWithoutAccessNestedInput
    branch?: BranchUpdateOneWithoutAccessNestedInput
  }

  export type BranchAccessUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    school_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type BranchAccessUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    school_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type AccessControlUpdateWithoutUserInput = {
    access?: StringFieldUpdateOperationsInput | string
    branch?: BranchUpdateOneWithoutControlNestedInput
  }

  export type AccessControlUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    branch_uuid?: StringFieldUpdateOperationsInput | string
    access?: StringFieldUpdateOperationsInput | string
  }

  export type AccessControlUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    branch_uuid?: StringFieldUpdateOperationsInput | string
    access?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateManySchoolInput = {
    id?: number
    uuid?: string
    name?: string | null
    email: string
    password: string
    contact?: string | null
    alt_contact?: string | null
    avatar?: string | null
    address?: string | null
    role?: $Enums.Role
    position?: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BranchCreateManySchoolInput = {
    id?: number
    uuid?: string
    name: string
    email?: string | null
    contact?: string | null
    avatar?: string | null
    address?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BranchAccessCreateManySchoolInput = {
    id?: number
    role: $Enums.Role
    user_uuid: string
    branch_uuid: string
  }

  export type UserUpdateWithoutSchoolInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUpdateManyWithoutParentNestedInput
    access?: BranchAccessUpdateManyWithoutUserNestedInput
    control?: AccessControlUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSchoolInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUncheckedUpdateManyWithoutParentNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutUserNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutSchoolInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    alt_contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    position?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BranchUpdateWithoutSchoolInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUpdateManyWithoutBranchNestedInput
    classes?: ClassUpdateManyWithoutBranchNestedInput
    students?: StudentUpdateManyWithoutBranchNestedInput
    control?: AccessControlUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUpdateManyWithoutBranchNestedInput
  }

  export type BranchUncheckedUpdateWithoutSchoolInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grades?: GradeUncheckedUpdateManyWithoutBranchNestedInput
    classes?: ClassUncheckedUpdateManyWithoutBranchNestedInput
    students?: StudentUncheckedUpdateManyWithoutBranchNestedInput
    control?: AccessControlUncheckedUpdateManyWithoutBranchNestedInput
    access?: BranchAccessUncheckedUpdateManyWithoutBranchNestedInput
  }

  export type BranchUncheckedUpdateManyWithoutSchoolInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BranchAccessUpdateWithoutSchoolInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    user?: UserUpdateOneWithoutAccessNestedInput
    branch?: BranchUpdateOneWithoutAccessNestedInput
  }

  export type BranchAccessUncheckedUpdateWithoutSchoolInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    user_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type BranchAccessUncheckedUpdateManyWithoutSchoolInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    user_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type GradeCreateManyBranchInput = {
    id?: number
    uuid?: string
    score: number
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ClassCreateManyBranchInput = {
    id?: number
    uuid?: string
    name: string
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type StudentCreateManyBranchInput = {
    id?: number
    uuid?: string
    parent_uuid: string
    class_uuid: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AccessControlCreateManyBranchInput = {
    id?: number
    user_uuid: string
    access: string
  }

  export type BranchAccessCreateManyBranchInput = {
    id?: number
    role: $Enums.Role
    user_uuid: string
    school_uuid: string
  }

  export type GradeUpdateWithoutBranchInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradeUncheckedUpdateWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradeUncheckedUpdateManyWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassUpdateWithoutBranchInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjects?: SubjectUpdateManyWithoutClassNestedInput
    students?: StudentUpdateManyWithoutClassNestedInput
  }

  export type ClassUncheckedUpdateWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjects?: SubjectUncheckedUpdateManyWithoutClassNestedInput
    students?: StudentUncheckedUpdateManyWithoutClassNestedInput
  }

  export type ClassUncheckedUpdateManyWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUpdateWithoutBranchInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: UserUpdateOneRequiredWithoutStudentsNestedInput
    class?: ClassUpdateOneRequiredWithoutStudentsNestedInput
    results?: ResultUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    parent_uuid?: StringFieldUpdateOperationsInput | string
    class_uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    results?: ResultUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateManyWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    parent_uuid?: StringFieldUpdateOperationsInput | string
    class_uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessControlUpdateWithoutBranchInput = {
    access?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneWithoutControlNestedInput
  }

  export type AccessControlUncheckedUpdateWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    access?: StringFieldUpdateOperationsInput | string
  }

  export type AccessControlUncheckedUpdateManyWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    access?: StringFieldUpdateOperationsInput | string
  }

  export type BranchAccessUpdateWithoutBranchInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    user?: UserUpdateOneWithoutAccessNestedInput
    school?: SchoolUpdateOneWithoutAccessNestedInput
  }

  export type BranchAccessUncheckedUpdateWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    user_uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type BranchAccessUncheckedUpdateManyWithoutBranchInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    user_uuid?: StringFieldUpdateOperationsInput | string
    school_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type ResultCreateManyStudentInput = {
    id?: number
    uuid?: string
    class_name: string
    grade: string
    remark: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ResultUpdateWithoutStudentInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    class_name?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    assessments?: AssessmentsUpdateManyWithoutResultNestedInput
  }

  export type ResultUncheckedUpdateWithoutStudentInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    class_name?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    assessments?: AssessmentsUncheckedUpdateManyWithoutResultNestedInput
  }

  export type ResultUncheckedUpdateManyWithoutStudentInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    class_name?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    remark?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjectCreateManyClassInput = {
    id?: number
    uuid?: string
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type StudentCreateManyClassInput = {
    id?: number
    uuid?: string
    parent_uuid: string
    branch_uuid: string
    reg_number: string
    name: string
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubjectUpdateWithoutClassInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjectUncheckedUpdateWithoutClassInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjectUncheckedUpdateManyWithoutClassInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUpdateWithoutClassInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: UserUpdateOneRequiredWithoutStudentsNestedInput
    branch?: BranchUpdateOneRequiredWithoutStudentsNestedInput
    results?: ResultUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutClassInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    parent_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    results?: ResultUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateManyWithoutClassInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    parent_uuid?: StringFieldUpdateOperationsInput | string
    branch_uuid?: StringFieldUpdateOperationsInput | string
    reg_number?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentsCreateManyResultInput = {
    id?: number
    uuid?: string
    subject: string
    assignment: number
    assesment: number
    examination: number
    overall: number
    grade: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AssessmentsUpdateWithoutResultInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    assignment?: FloatFieldUpdateOperationsInput | number
    assesment?: FloatFieldUpdateOperationsInput | number
    examination?: FloatFieldUpdateOperationsInput | number
    overall?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentsUncheckedUpdateWithoutResultInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    assignment?: FloatFieldUpdateOperationsInput | number
    assesment?: FloatFieldUpdateOperationsInput | number
    examination?: FloatFieldUpdateOperationsInput | number
    overall?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessmentsUncheckedUpdateManyWithoutResultInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    assignment?: FloatFieldUpdateOperationsInput | number
    assesment?: FloatFieldUpdateOperationsInput | number
    examination?: FloatFieldUpdateOperationsInput | number
    overall?: FloatFieldUpdateOperationsInput | number
    grade?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}