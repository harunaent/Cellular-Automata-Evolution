;; Evolution Parameters Contract

(define-map evolution-parameters
  uint
  {
    automata-id: uint,
    generations: uint,
    mutation-rate: uint,
    crossover-rate: uint,
    population-size: uint,
    fitness-function: (string-utf8 1000)
  }
)

(define-data-var parameter-count uint u0)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))
(define-constant ERR_INVALID_PARAMETERS (err u404))

(define-public (set-evolution-parameters (automata-id uint) (generations uint) (mutation-rate uint) (crossover-rate uint) (population-size uint) (fitness-function (string-utf8 1000)))
  (let
    (
      (parameter-id (+ (var-get parameter-count) u1))
    )
    (asserts! (is-some (contract-call? .cellular-automata-management get-cellular-automata automata-id)) ERR_INVALID_PARAMETERS)
    (map-set evolution-parameters
      parameter-id
      {
        automata-id: automata-id,
        generations: generations,
        mutation-rate: mutation-rate,
        crossover-rate: crossover-rate,
        population-size: population-size,
        fitness-function: fitness-function
      }
    )
    (var-set parameter-count parameter-id)
    (ok parameter-id)
  )
)

(define-public (update-evolution-parameters (parameter-id uint) (generations uint) (mutation-rate uint) (crossover-rate uint) (population-size uint) (fitness-function (string-utf8 1000)))
  (let
    (
      (params (unwrap! (map-get? evolution-parameters parameter-id) ERR_INVALID_PARAMETERS))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set evolution-parameters
      parameter-id
      (merge params {
        generations: generations,
        mutation-rate: mutation-rate,
        crossover-rate: crossover-rate,
        population-size: population-size,
        fitness-function: fitness-function
      })
    ))
  )
)

(define-read-only (get-evolution-parameters (parameter-id uint))
  (map-get? evolution-parameters parameter-id)
)

(define-read-only (get-parameter-count)
  (var-get parameter-count)
)

